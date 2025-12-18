/**
 * Firebase Cloud Function to decode DigiPIN
 * Triggers when an operational post is created or updated
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

interface DigipinDecodeResponse {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

/**
 * Decode DigiPIN using India Post API
 */
async function decodeDigipin(digipin: string): Promise<DigipinDecodeResponse | null> {
  try {
    // Remove hyphens from DigiPIN
    const cleanDigipin = digipin.replace(/-/g, '');
    
    // Call India Post DigiPIN API
    const response = await axios.get(
      `https://api.indiapost.gov.in/digipin/v1/decode`,
      {
        params: { digipin: cleanDigipin },
        headers: {
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    if (response.data && response.data.latitude && response.data.longitude) {
      return {
        latitude: parseFloat(response.data.latitude),
        longitude: parseFloat(response.data.longitude),
        accuracy: response.data.accuracy || 0,
        address: response.data.address || ''
      };
    }

    return null;
  } catch (error) {
    console.error('DigiPIN decode error:', error);
    return null;
  }
}

/**
 * Cloud Function: Triggered when operational post is created
 */
export const onPostCreated = functions.firestore
  .document('operationalPosts/{postId}')
  .onCreate(async (snapshot, context) => {
    const postData = snapshot.data();
    const postId = context.params.postId;

    console.log(`Processing new post: ${postId}`);

    // Check if DigiPIN exists and coordinates are not set
    if (postData.location?.digipin && 
        (!postData.location.latitude || postData.location.latitude === 0)) {
      
      console.log(`Decoding DigiPIN: ${postData.location.digipin}`);
      
      const decoded = await decodeDigipin(postData.location.digipin);

      if (decoded) {
        // Update post with decoded coordinates
        await snapshot.ref.update({
          'location.latitude': decoded.latitude,
          'location.longitude': decoded.longitude,
          'location.accuracy': decoded.accuracy || 0,
          'location.decodedAt': admin.firestore.FieldValue.serverTimestamp(),
          'updatedAt': admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`Successfully decoded DigiPIN for post ${postId}:`, decoded);
      } else {
        console.warn(`Failed to decode DigiPIN for post ${postId}`);
        
        // Mark as decode failed
        await snapshot.ref.update({
          'location.decodeError': 'Failed to decode DigiPIN',
          'location.decodeAttemptedAt': admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }
  });

/**
 * Cloud Function: Triggered when operational post is updated
 */
export const onPostUpdated = functions.firestore
  .document('operationalPosts/{postId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    const postId = context.params.postId;

    // Check if DigiPIN was added or changed
    const digipinChanged = beforeData.location?.digipin !== afterData.location?.digipin;
    const needsDecoding = afterData.location?.digipin && 
                         (!afterData.location.latitude || afterData.location.latitude === 0);

    if (digipinChanged && needsDecoding) {
      console.log(`DigiPIN changed for post ${postId}, re-decoding...`);
      
      const decoded = await decodeDigipin(afterData.location.digipin);

      if (decoded) {
        await change.after.ref.update({
          'location.latitude': decoded.latitude,
          'location.longitude': decoded.longitude,
          'location.accuracy': decoded.accuracy || 0,
          'location.decodedAt': admin.firestore.FieldValue.serverTimestamp(),
          'updatedAt': admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`Successfully re-decoded DigiPIN for post ${postId}:`, decoded);
      } else {
        console.warn(`Failed to re-decode DigiPIN for post ${postId}`);
        
        await change.after.ref.update({
          'location.decodeError': 'Failed to decode DigiPIN',
          'location.decodeAttemptedAt': admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }
  });

/**
 * HTTP Function: Manual DigiPIN decode endpoint
 * Can be called directly if needed
 */
export const decodeDigipinHttp = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  const digipin = req.query.digipin as string || req.body.digipin;

  if (!digipin) {
    res.status(400).json({ error: 'DigiPIN parameter is required' });
    return;
  }

  const decoded = await decodeDigipin(digipin);

  if (decoded) {
    res.status(200).json({
      success: true,
      data: decoded
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Failed to decode DigiPIN'
    });
  }
});

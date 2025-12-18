
import { useState, useEffect } from "react";
import { firebaseDB } from "@/services/firebase/FirebaseService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface FirebaseCollectionViewerProps {
  collectionName: string;
  title?: string;
  fieldOrder?: string[];
  limit?: number;
  filter?: {
    field: string;
    operator: string;
    value: any;
  };
  orderBy?: {
    field: string;
    direction?: 'asc' | 'desc';
  };
}

export function FirebaseCollectionViewer({
  collectionName,
  title,
  fieldOrder = [],
  limit = 10,
  filter,
  orderBy
}: FirebaseCollectionViewerProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let result;
        
        if (filter) {
          // Fetch with filter
          result = await firebaseDB.queryCollection(
            collectionName,
            filter.field,
            filter.operator,
            filter.value,
            orderBy?.field,
            orderBy?.direction
          );
        } else {
          // Fetch all data
          result = await firebaseDB.getCollection(collectionName);
          
          // Apply order manually if needed
          if (orderBy) {
            result.sort((a, b) => {
              if (orderBy.direction === 'desc') {
                return b[orderBy.field] > a[orderBy.field] ? 1 : -1;
              }
              return a[orderBy.field] > b[orderBy.field] ? 1 : -1;
            });
          }
        }
        
        // Apply limit
        setData(result.slice(0, limit));
        setError(null);
      } catch (err: any) {
        console.error("Error fetching Firebase data:", err);
        setError(err.message || "Failed to load data");
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [collectionName, filter, orderBy, limit]);
  
  // Extract fields to display
  const fields = fieldOrder.length > 0 
    ? fieldOrder 
    : data.length > 0 
      ? Object.keys(data[0]).filter(key => key !== 'id') 
      : [];
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || collectionName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4 text-red-500">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || collectionName}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {fields.map(field => (
                    <TableHead key={field}>{field}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={item.id || index}>
                    {fields.map(field => (
                      <TableCell key={`${item.id}-${field}`}>
                        {typeof item[field] === 'object' ? JSON.stringify(item[field]) : String(item[field] || '')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            No data found in collection
          </div>
        )}
      </CardContent>
    </Card>
  );
}

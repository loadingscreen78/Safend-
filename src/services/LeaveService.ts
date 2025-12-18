
import { UninformedLeave, AbscondCase, LeaveApplication } from "@/pages/hr/components";
import { HR_CONFIG } from "@/config";
import { mockUninformedLeaves } from "@/data/mockUninformedLeaves";
import { mockAbscondCases } from "@/data/mockAbscondCases";
import { emitEvent, EVENT_TYPES } from "./EventService";

// Store uninformed leaves and abscond cases in memory
let uninformedLeaves = [...mockUninformedLeaves];
let abscondCases = [...mockAbscondCases];

// Detect uninformed leave based on attendance event
export const detectUninformedLeave = (attendanceEvent: { 
  employeeId: string;
  employeeName: string;
  date: string;
  status: string;
  postId?: string;
  branchId?: string;
}) => {
  if (attendanceEvent.status !== 'Absent') {
    return null;
  }
  
  // Check if approved leave exists for this date and employee
  // In a real app, this would query the leave records
  const hasApprovedLeave = false; // Mock data - would check leave records
  
  if (hasApprovedLeave) {
    return null;
  }
  
  // Create new uninformed leave record
  const newUninformedLeave: UninformedLeave = {
    id: `UL${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    employeeId: attendanceEvent.employeeId,
    employeeName: attendanceEvent.employeeName,
    date: attendanceEvent.date,
    detectedBy: "system",
    timestamp: new Date().toISOString(),
    postId: attendanceEvent.postId,
    branchId: attendanceEvent.branchId
  };
  
  uninformedLeaves.push(newUninformedLeave);
  
  // Check for consecutive uninformed leaves
  checkConsecutiveUninformedLeaves(attendanceEvent.employeeId);
  
  return newUninformedLeave;
};

// Check for consecutive uninformed leaves and escalate if needed
export const checkConsecutiveUninformedLeaves = (employeeId: string) => {
  // Get uninformed leaves for this employee sorted by date
  const employeeLeaves = uninformedLeaves
    .filter(leave => 
      leave.employeeId === employeeId && 
      !leave.resolution // Only count unresolved leaves
    )
    .sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  
  if (employeeLeaves.length < HR_CONFIG.LEAVE.UNINFORMED_THRESHOLD) {
    return false;
  }
  
  // Check if leaves are consecutive
  let consecutiveCount = 1;
  let previousDate = new Date(employeeLeaves[0].date);
  
  for (let i = 1; i < employeeLeaves.length; i++) {
    const currentDate = new Date(employeeLeaves[i].date);
    const timeDiff = currentDate.getTime() - previousDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    
    if (daysDiff === 1) {
      consecutiveCount++;
      if (consecutiveCount >= HR_CONFIG.LEAVE.UNINFORMED_THRESHOLD) {
        // Threshold met, escalate to abscond case
        return escalateAbscond(employeeId, employeeLeaves);
      }
    } else {
      consecutiveCount = 1;
    }
    
    previousDate = currentDate;
  }
  
  return false;
};

// Escalate to abscond case
export const escalateAbscond = (employeeId: string, leaves: UninformedLeave[]) => {
  // Check if abscond case already exists for this employee
  const existingCase = abscondCases.find(
    c => c.employeeId === employeeId && c.status === "PENDING"
  );
  
  if (existingCase) {
    return existingCase;
  }
  
  // Get employee name from leaves
  const employeeName = leaves.length > 0 ? leaves[0].employeeName : "Unknown Employee";
  
  // Create new abscond case
  const startDate = leaves.length > 0 ? leaves[0].date : new Date().toISOString().split('T')[0];
  const lastContactDate = new Date(new Date(startDate).getTime() - 86400000).toISOString().split('T')[0];
  
  const newAbscondCase: AbscondCase = {
    id: `ABS${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    employeeId,
    employeeName,
    startDate,
    lastContact: lastContactDate,
    status: "PENDING",
    remarks: "Auto-escalated after 3 consecutive uninformed absences",
    createdAt: new Date().toISOString(),
    salaryCut: true
  };
  
  abscondCases.push(newAbscondCase);
  
  // Emit event for abscond case created
  emitEvent(EVENT_TYPES.ABSCOND_CASE_CREATED, newAbscondCase);
  
  return newAbscondCase;
};

// Resolve uninformed leave
export const resolveUninformedLeave = (leaveId: string, resolution: 'Regularized' | 'Converted' | 'Marked Abscond', resolvedBy: string) => {
  // Find and update the leave
  const leaveIndex = uninformedLeaves.findIndex(leave => leave.id === leaveId);
  
  if (leaveIndex === -1) {
    return null;
  }
  
  uninformedLeaves[leaveIndex] = {
    ...uninformedLeaves[leaveIndex],
    resolution,
    resolvedBy
  };
  
  if (resolution === 'Converted') {
    // Create leave application (in a real app)
    // createLeaveApplication(...)
  }
  
  if (resolution === 'Marked Abscond') {
    // Create abscond case
    const leave = uninformedLeaves[leaveIndex];
    escalateAbscond(leave.employeeId, [leave]);
  }
  
  return uninformedLeaves[leaveIndex];
};

// Close abscond case
export const closeAbscondCase = (caseId: string, remarks: string, closedBy: string) => {
  const caseIndex = abscondCases.findIndex(c => c.id === caseId);
  
  if (caseIndex === -1) {
    return null;
  }
  
  abscondCases[caseIndex] = {
    ...abscondCases[caseIndex],
    status: "CLOSED",
    closedAt: new Date().toISOString(),
    closedBy,
    remarks: abscondCases[caseIndex].remarks + `\n${new Date().toLocaleDateString()}: ${remarks}`
  };
  
  return abscondCases[caseIndex];
};

// Get uninformed leaves
export const getUninformedLeaves = () => uninformedLeaves;

// Get abscond cases
export const getAbscondCases = () => abscondCases;

import { EnrollmentService } from '../enrollment/enrollment.service';
export declare class NotificationService {
    private readonly enrollmentService;
    constructor(enrollmentService: EnrollmentService);
    sendNotification(studentName: string, message: string): {
        message: string;
        recipient: string;
        content: string;
    };
    checkEnrollmentAndNotify(studentName: string, courseId: string): {
        status: string;
        student: string;
        courseId: string;
        enrollmentCheck: never[];
    };
}

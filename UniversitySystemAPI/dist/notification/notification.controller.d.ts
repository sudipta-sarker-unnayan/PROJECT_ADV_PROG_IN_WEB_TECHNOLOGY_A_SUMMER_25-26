import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    sendNotification(body: {
        studentName: string;
        message: string;
    }): {
        message: string;
        recipient: string;
        content: string;
    };
    checkEnrollmentAndNotify(body: {
        studentName: string;
        courseId: string;
    }): {
        status: string;
        student: string;
        courseId: string;
        enrollmentCheck: never[];
    };
}

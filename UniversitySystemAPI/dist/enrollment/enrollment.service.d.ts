import { CourseService } from '../course/course.service';
import { NotificationService } from '../notification/notification.service';
export declare class EnrollmentService {
    private readonly courseService;
    private readonly notificationService;
    constructor(courseService: CourseService, notificationService: NotificationService);
    getEnrollments(): {
        message: string;
        data: never[];
    };
    enrollStudent(studentName: string, courseId: string): {
        message: string;
        student: string;
        course: {
            message: string;
            id: string;
        };
        notification: {
            message: string;
            recipient: string;
            content: string;
        };
    };
}

import { EnrollmentService } from './enrollment.service';
export declare class EnrollmentController {
    private readonly enrollmentService;
    constructor(enrollmentService: EnrollmentService);
    getEnrollments(): {
        message: string;
        data: never[];
    };
    enrollStudent(body: {
        studentName: string;
        courseId: string;
    }): {
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

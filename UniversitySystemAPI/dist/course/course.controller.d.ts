import { CourseService } from './course.service';
export declare class CourseController {
    private readonly courseService;
    constructor(courseService: CourseService);
    getAllCourses(): {
        message: string;
        data: never[];
    };
    getCourseById(id: string): {
        message: string;
        id: string;
    };
    createCourse(body: {
        name: string;
        code: string;
    }): {
        message: string;
        data: {
            name: string;
            code: string;
        };
    };
}

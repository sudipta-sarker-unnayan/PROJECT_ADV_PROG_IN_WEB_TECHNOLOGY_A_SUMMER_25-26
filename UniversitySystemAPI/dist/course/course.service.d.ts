export declare class CourseService {
    getAllCourses(): {
        message: string;
        data: never[];
    };
    getCourseById(id: string): {
        message: string;
        id: string;
    };
    createCourse(name: string, code: string): {
        message: string;
        data: {
            name: string;
            code: string;
        };
    };
}

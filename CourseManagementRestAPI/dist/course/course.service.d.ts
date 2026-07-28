import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CourseService {
    getAllCourses(): {
        message: string;
        data: any[];
    };
    getCourseById(id: string): {
        message: string;
        id: string;
    };
    createCourse(dto: CreateCourseDto): {
        message: string;
        data: CreateCourseDto;
    };
    updateCourse(id: string, dto: UpdateCourseDto): {
        message: string;
        id: string;
        data: UpdateCourseDto;
    };
    patchCourse(id: string, dto: UpdateCourseDto): {
        message: string;
        id: string;
        updatedFields: string[];
    };
    deleteCourse(id: string): {
        message: string;
        id: string;
    };
    uploadCourseMaterial(id: string, file: any): {
        message: string;
        courseId: string;
        filename: any;
        path: any;
    };
}

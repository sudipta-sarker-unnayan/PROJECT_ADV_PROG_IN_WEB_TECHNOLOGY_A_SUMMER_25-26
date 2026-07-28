import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CourseController {
    private readonly courseService;
    constructor(courseService: CourseService);
    getAllCourses(): {
        message: string;
        data: any[];
    };
    getCourseById(id: string): {
        message: string;
        id: string;
    };
    createCourse(createCourseDto: CreateCourseDto): {
        message: string;
        data: CreateCourseDto;
    };
    updateCourse(id: string, updateCourseDto: CreateCourseDto): {
        message: string;
        id: string;
        data: UpdateCourseDto;
    };
    patchCourse(id: string, updateCourseDto: UpdateCourseDto): {
        message: string;
        id: string;
        updatedFields: string[];
    };
    deleteCourse(id: string): {
        message: string;
        id: string;
    };
    uploadFile(id: string, file: Express.Multer.File): {
        message: string;
        courseId: string;
        filename: any;
        path: any;
    };
}

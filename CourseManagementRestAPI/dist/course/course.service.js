"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
let CourseService = class CourseService {
    getAllCourses() {
        return { message: 'successfully', data: [] };
    }
    getCourseById(id) {
        return { message: 'successfully', id };
    }
    createCourse(dto) {
        return { message: 'successfullya', data: dto };
    }
    updateCourse(id, dto) {
        return { message: 'successfully', id, data: dto };
    }
    patchCourse(id, dto) {
        const updatedFields = Object.keys(dto);
        return { message: 'patched successfully', id, updatedFields };
    }
    deleteCourse(id) {
        return { message: 'deleted successfully', id };
    }
    uploadCourseMaterial(id, file) {
        if (!file) {
            throw new common_1.BadRequestException('File upload failed.');
        }
        return {
            message: 'uploaded successfully',
            courseId: id,
            filename: file.filename,
            path: file.path.replace(/\\/g, '/'),
        };
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)()
], CourseService);
//# sourceMappingURL=course.service.js.map
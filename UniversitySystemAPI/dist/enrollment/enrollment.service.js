"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentService = void 0;
const common_1 = require("@nestjs/common");
const course_service_1 = require("../course/course.service");
const notification_service_1 = require("../notification/notification.service");
let EnrollmentService = class EnrollmentService {
    courseService;
    notificationService;
    constructor(courseService, notificationService) {
        this.courseService = courseService;
        this.notificationService = notificationService;
    }
    getEnrollments() {
        return { message: 'All enrollments fetched', data: [] };
    }
    enrollStudent(studentName, courseId) {
        const courseInfo = this.courseService.getCourseById(courseId);
        const notificationInfo = this.notificationService.sendNotification(studentName, `Welcome to course ${courseId}!`);
        return {
            message: 'Student enrolled successfully',
            student: studentName,
            course: courseInfo,
            notification: notificationInfo,
        };
    }
};
exports.EnrollmentService = EnrollmentService;
exports.EnrollmentService = EnrollmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => notification_service_1.NotificationService))),
    __metadata("design:paramtypes", [course_service_1.CourseService,
        notification_service_1.NotificationService])
], EnrollmentService);
//# sourceMappingURL=enrollment.service.js.map
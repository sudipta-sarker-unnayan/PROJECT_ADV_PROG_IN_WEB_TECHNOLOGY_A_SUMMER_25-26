import { Employee } from "src/employees/entities/employee.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum AttendenceStatus{
    PRESENT='present',
    ABSENT='absent',
    LATE='late',
}

@Entity('attendence')
export class Attendence {
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        type:'date'
    })
    date:Date

    @Column({
        type:'date',
        nullable:false
    })
    checkIn:string

    @Column({
        type:'date',
        nullable:true
    })
    checkOut:string

    @Column({
        type:'enum',
        enum:AttendenceStatus,
        default:AttendenceStatus.ABSENT,
    })
    status:AttendenceStatus

    @CreateDateColumn()
    createAt:Date

    @ManyToOne(()=>Employee,(employee)=>employee.attendence,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:'employeeId'})
    employee: Employee




}

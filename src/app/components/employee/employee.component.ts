import { Component, OnInit, signal } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Employee from '../../models/employee';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  constructor(public employeeService: EmployeeService) { }

  employeeForm = signal<FormGroup>(
    new FormGroup({
      name: new FormControl(''),
      office: new FormControl(''),
      position: new FormControl(''),
      salary: new FormControl(0),
    })
  )

  employeeSelected : boolean = false;
  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    console.log(this.employeeService.getEmployees().subscribe({
      next : (res) => this.employeeService.employees = res,
      error : (e) => console.error(e)}));
  }

  addEmployee() {
    this.employeeService.selectedEmployee = this.employeeForm().value;
    console.log(this.employeeService.selectedEmployee);
    this.employeeService.createEmployee(this.employeeService.selectedEmployee).subscribe({
      next : (res) => this.getEmployees(),
      error : (e) => this.getEmployees()
    });
    this.getEmployees()
  }

  deleteEmployee(_id : string) {
    if(confirm('Are you sure you want to delete it?'))
      this.employeeService.deleteEmployee(_id).subscribe({
        next : (res) => this.getEmployees(),
        error : (e) => this.getEmployees()});
  }

  editEmployee(id : string) {
    this.employeeService.selectedEmployee = this.employeeForm().value;
    if(this.employeeSelected){
      console.log(this.employeeService.selectedEmployee);
      this.employeeService.editEmployee(this.employeeService.selectedEmployee, id).subscribe({
        next : (res) => this.getEmployees(),
        error : (e) => this.getEmployees()});
      this.employeeSelected = false;
    }
  }

  selectEmployee(employee: Employee){
    this.employeeSelected = true;
    this.employeeForm = signal<FormGroup>(
      new FormGroup({
        name: new FormControl(employee.name),
        office: new FormControl(employee.office),
        position: new FormControl(employee.position),
        salary: new FormControl(employee.salary),
      })
    )
  }

}

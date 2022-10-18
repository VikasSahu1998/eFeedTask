import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpdialogComponent } from './empdialog/empdialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'crud_Mat';

  displayedColumns: string[] = ['id', 'name', 'lname', 'genders', 'date', 'age', 'address', 'pnumber', 'pincode', 'state', 'district', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(public dialog: MatDialog, private api: ApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getalldetail();
  }

  openDialog() {
    this.dialog.open(EmpdialogComponent, {
      width: '33%',
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getalldetail();
      }
    })
  }

  getalldetail() {
    this.api.getEmp()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        },
        error: (err) => {
          this.toastr.error('error while fetching the data', 'error', { timeOut: 2000, });
        }
      })
  }
  editdetail(row: any) {
    this.dialog.open(EmpdialogComponent, {
      width: '33%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getalldetail();
      }
    })
  }

  deletedetail(id: number) {
    this.api.deleteEmp(id)
      .subscribe({
        next: (res) => {
          this.toastr.success('details deleted successfully', 'successfully', { timeOut: 2000, });
          this.getalldetail();
        },
        error: () => {
          this.toastr.error('someting went wrong', 'error', { timeOut: 2000, });
        }
      })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


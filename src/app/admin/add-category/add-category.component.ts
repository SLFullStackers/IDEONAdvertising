import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { CategoryService } from 'src/app/services/category.service';
import { MyCategoryComponent } from './my-category/my-category.component';
import {DialogService} from '../../services/dialog.service';
import {NotificationService} from '../../services/notification.service';
import {ProgressDialogComponent} from '../../shared/progress-dialog/progress-dialog.component';
import * as util from '../../model/util';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  displayedColumns: string[] = ['id', 'code', 'name', 'action'];
  dataSource = new MatTableDataSource<any>();
  searchKey: string;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private categoryService: CategoryService,
              private dialog: MatDialog,
              private dialogService: DialogService,
              private notificationService: NotificationService,
    ) { }

  ngOnInit() {
    const dialogRef = this.dialog.open(ProgressDialogComponent, util.getProgressDialogData());
    dialogRef.afterOpened().subscribe(() => {
      this.categoryService.loadCategories().subscribe(data => {
        this.dataSource.data = data;
        dialogRef.close();
      });
    });
  }
  onEdit(row) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = row;
    this.dialog.open(MyCategoryComponent, dialogConfig);
  }

  onDelete(id) {
    this.dialogService.openConfirmDialog('Are you sure to delete ?')
      .afterClosed().subscribe(res => {
      if (res) {
        this.categoryService.deleteCategory(id);
        this.notificationService.warn('Successfully Deleted!');
      }
      this.ngOnInit();
    });
  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    this.dialog.open(MyCategoryComponent, dialogConfig);
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

}

export interface CategoryTable {
  id: string;
  code: string;
  name: string;
  action: any;
}

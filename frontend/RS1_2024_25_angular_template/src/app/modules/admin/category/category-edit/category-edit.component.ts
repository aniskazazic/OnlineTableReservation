import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {CategoryService,Category} from '../../../../endpoints/CategoryControllers/CategoryController';


@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {
  categoryId: number;
  category: Category = {id:0, name: '', description: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.categoryId = 0;
  }

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.categoryId) {
      this.loadCategoryData();
    }
  }

  loadCategoryData(): void {
    this.categoryService.getById(this.categoryId).subscribe({
      next: (data) => this.category = data,
      error: (error) => console.error('Error loading category data', error)
    });
  }

  saveCategory(): void {
    if (this.categoryId === 0) {
      // Create new
      this.categoryService.create(this.category).subscribe({
        next: () => this.router.navigate(['/admin/categories']),
        error: (error) => console.error('Error creating category', error)
      });
    } else {
      // Update existing
      this.categoryService.update(this.categoryId, this.category).subscribe({
        next: () => this.router.navigate(['/admin/categories']),
        error: (error) => console.error('Error updating category', error)
      });
    }
  }
}

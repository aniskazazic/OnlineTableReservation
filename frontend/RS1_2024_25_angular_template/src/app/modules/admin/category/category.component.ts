import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CategoryService,Category} from '../../../endpoints/CategoryControllers/CategoryController';


@Component({
  selector: 'app-category-list',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  editCategory(id: number): void {
    this.router.navigate(['/admin/categories/edit', id]);
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.delete(id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== id);
        },
        error: (err) => console.error('Error deleting category:', err)
      });
    }
  }
}

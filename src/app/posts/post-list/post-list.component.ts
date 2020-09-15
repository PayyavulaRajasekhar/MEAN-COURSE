import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [] ;
  private postSubscription: Subscription;
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 3;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10];
  userIsAuthenticated = false;
  private authStatusListenerSubscription: Subscription;
  constructor(public postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postSubscription = this.postService.getPostupdateListener().subscribe(postData => {
      this.posts = postData.posts;
      this.totalPosts = postData.totalPosts;
      this.isLoading = false;
    });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusListenerSubscription = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onDeletePost(postId: string) {
    this.postService.deletePost(postId).subscribe(response => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onPageChange(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
    this.authStatusListenerSubscription.unsubscribe();
  }

}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<{ totalPosts: number, posts: Post[] }>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{
      message: string,
      posts: { _id: string, title: string, content: string, imagePath: string }[],
      totalPosts: number
     }>(
      'http://localhost:3000/api/posts'+queryParams
      )
      .pipe(map(postData => {
        return {
          totalPosts: postData.totalPosts,
          posts : postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            }
          })
         }
      }))
      .subscribe(transformedData => {
        this.posts = transformedData.posts;
        console.log(this.posts);
        this.postsUpdated.next({
          posts: [...this.posts],
          totalPosts: transformedData.totalPosts
        });
      });
  }

  getPostupdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image);
    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }

  getPost(postId: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(
      'http://localhost:3000/api/posts/' + postId
    ).pipe(map(postData => {
      return {
        id: postData._id,
        title: postData.title,
        content: postData.content,
        imagePath: postData.imagePath
      }
    }));
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      }
    }
    this.http.put<{message: string, post: Post}>('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

}

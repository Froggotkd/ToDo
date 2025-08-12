import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comments, CommentsService } from '../../../services/comments-service';
import { MatIconModule } from "@angular/material/icon";
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { CommonModule } from '@angular/common';
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment',
  imports: [MatIconModule, MatMenu, MatMenuModule, CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {
  replies: Comments[] = [];
  currentUrl: string = "";
  constructor(private commentsService: CommentsService, private router: Router) { }
  @Input() comment!: Comments;
  @Input() comments: Comments[] = [];
  @Input() reply!: Comments;
  @Input() repliesArray: Comments[] = [];

  @Output() updateComment = new EventEmitter<{ id: number, comment: string }>();
  onUpdateClick(id: number, comment: string) {
    id = this.comment.id;
    comment = this.comment.comment;
    this.updateComment.emit({ id, comment });
    this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.currentUrl]);
    });
  }

  @Output() deleteComment = new EventEmitter<{ id: number }>();
  onDeleteClick(id: number) {
    id = this.comment.id;
    this.deleteComment.emit({ id });
    this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.currentUrl]);
    });
  }

  ngOnInit() {
    this.getReplies();
    this.currentUrl = this.router.url;
  }

  getReplies(): void {
    console.log(this.comment.id)
    if (!this.comment?.id) return;

    this.commentsService.getReplies(this.comment.id).subscribe({
      next: (data) => {
        this.replies = data;
        this.replies.forEach(c => {
          console.log("parent", c.parentCommentId, "comment", this.comment.id);
        });
      }
    });
  }


}

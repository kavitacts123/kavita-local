import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { WebPages } from '../../../../../services/webpages.service';
import { NgForm } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { CKEditorModule, loadCKEditorCloud, CKEditorCloudResult } from '@ckeditor/ckeditor5-angular';
import type { ClassicEditor, EditorConfig } from 'https://cdn.ckeditor.com/typings/ckeditor5.d.ts';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

import {
  MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

interface Language {
  id: string;
  description: string;
  language: string;
  status: string;
  updated_at: string;
  created_at: string;
  slug: string;
}
@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrl: './add-page.component.scss'
})
export class AddPageComponent {
  languages: Language[] = [];
  title: string = '';
  content: string = '';
  selectedLanguage: string = '1';
  featured_image: File | null = null;
  status: number = 1;
  slug: string = '';
  public Editor: typeof ClassicEditor | null = null;
  public config: EditorConfig | null = null;
  pageDetail: any | null = null;
  @ViewChild('myForm') form!: NgForm;



  constructor(private webpages: WebPages, public dialogRef : MatDialogRef<AddPageComponent>, @Inject(MAT_DIALOG_DATA) public data: any ) { 
   }
  ngOnInit() {
    this.getAllLanguages();
    loadCKEditorCloud({
      version: '44.0.0',
      premium: true
    }).then(this._setupEditor.bind(this));
    if(this.data){
      this.pageDetail = this.data.page
      this.title = this.pageDetail.title;
      this.slug = this.pageDetail.slug;
      this.status = (this.pageDetail.status == 'draft') ? 1 : 2;
      this.selectedLanguage = '3';
      this.title = this.pageDetail.title;
    }
  }

  private _setupEditor ( cloud: CKEditorCloudResult<{ version: '44.0.0', premium: true }> ) {
    const {
        ClassicEditor,
        Essentials,
        Paragraph,
        Bold,
        Italic,
        Underline,
          Strikethrough,
          Heading,
          Link,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageUpload,
          MediaEmbed,
          BlockQuote,
          TableToolbar,
          TableProperties,
          TableCellProperties,
          List,
          ListProperties,
          FontColor,
          FontBackgroundColor,
          FontSize,
          FontFamily,
          Alignment,
          RemoveFormat,
          SourceEditing,
          Highlight,
          Code,
          CodeBlock,
          HtmlEmbed,
          PasteFromOffice,
          PageBreak,
          FindAndReplace,
          AutoImage,
          AutoLink,
          WordCount
    } = cloud.CKEditor;

    const { FormatPainter } = cloud.CKEditorPremiumFeatures;

    this.Editor = ClassicEditor;
    this.config = {
        licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3MzQ1NjYzOTksImp0aSI6IjkwOTllOWVhLTc3ZjYtNDU2MC05NDZlLTc4MjAyNmU5YjNmMyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjZjMzY4MDY2In0.jtmAfAvHMSY5Vc7tQXzwW7gqpoXNWqUogE7XIy5B7CGIhMhrONSxbkiFu4--974P4dsnPICxa1a_GB_7ofzNng',
        plugins: [
          Essentials,
          Paragraph,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Heading,
          Link,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageUpload,
          MediaEmbed,
          BlockQuote,
          TableToolbar,
          TableProperties,
          TableCellProperties,
          List,
          ListProperties,
          FontColor,
          FontBackgroundColor,
          FontSize,
          FontFamily,
          Alignment,
          RemoveFormat,
          SourceEditing,
          Highlight,
          Code,
          CodeBlock,
          HtmlEmbed,
          PasteFromOffice,
          PageBreak,
          FindAndReplace,
          FormatPainter,
          AutoImage,
          AutoLink,
          WordCount
        ],
        toolbar: [
          'heading', '|',
          'bold', 'italic', 'underline', 'strikethrough', '|',
          'link', 'imageUpload', 'mediaEmbed', '|',
          'bulletedList', 'numberedList', 'blockQuote', '|',
          'insertTable', '|',
          'undo', 'redo', '|',
          'alignment', '|',
          'fontColor', 'fontBackgroundColor', '|',
          'fontSize', 'fontFamily', '|',
          'removeFormat', '|',
          'sourceEditing', '|',
          'highlight', 'code', 'codeBlock', '|',
          'htmlEmbed', '|',
          'exportPdf', 'exportWord', '|',
          'pageBreak', '|',
          'findAndReplace', 'formatPainter'
        ],
        image: {
          toolbar: [
            'imageTextAlternative',
            'imageStyle:full',
            'imageStyle:side',
            'linkImage'
          ]
        },
        table: {
          contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'tableProperties',
            'tableCellProperties'
          ]
        }
    };
}

  getAllLanguages() {
    this.webpages.getAllLanguage().subscribe((response) => {
      if (response.status) {
        this.languages = response.data.languages;
      }
    });
  }

  getSlug(event: any) {
    setTimeout(() => {
      let slug = this.makeTitleSlug(event.target.value);
      this.slug = slug;
    }, 1000);
  }

  makeTitleSlug(str: string) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
    str = str.toLowerCase(); // convert string to lowercase
    str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // remove consecutive hyphens
    return str;
  }

  onSubmit(): void {
    let formData = new FormData();
    let form = this.form.value;
    form.featured_image = this.featured_image
    form.content = this.content
    form.language = this.selectedLanguage;
    formData.append('title', form.title);
    formData.append('status', form.status);
    formData.append('slug', form.slug);
    formData.append('language', form.language);
    formData.append('content', form.content);
    formData.append('featured_image', form.featured_image);
    this.addNewPage(formData);
  }

  handleFileInput(files: Event) {
    const input = files.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.featured_image = file
      console.log(this.featured_image, 'handle-file-Input');
    }
  }

  onChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
    this.content = data;
  }

  onEditorReady(editor: any): void {
    const editableElement = editor.ui.view.editable.element;
    editableElement.style.height = '300px'; // Set desired height
  }

  addNewPage(form: any){
    this.webpages.addNewPage(form).subscribe((res) => {
      if(res.status){
        this.dialogRef.close({
          action: "page-added-successfully"
        });
      }
    });
  }
}

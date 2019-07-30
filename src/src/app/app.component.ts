import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImagesService } from './services/images.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'Images';
	images = [];
	uploadedFiles: Array<File> = [];
	urls =  [];
	baseUrl = "http://localhost:3000/"
	
	constructor(private http : HttpClient, private imagesService: ImagesService){

  	}

	ngOnInit(){
		this.imagesService.getImages()
    		.subscribe(images => this.images = images);

	}

	fileChange(element){
		var self = this;
		var entries = element.target.files;

		for (var i=0; i<entries.length; i++) {
			var reader = new FileReader();
			this.uploadedFiles.push(entries[i]);
			reader.onloadend = (function(file) {
	      		return function(evt) {
	        		self.createListItem(evt, file)
	      		};
			})(entries[i]);
			reader.readAsDataURL(entries[i]);
	    }
		
	}
	createListItem(evt, file) {
		this.urls.push({image: evt.target.result, name: file.name})
	
	}

	upload(){
		let formData = new FormData();
		for(var i = 0; i < this.uploadedFiles.length; i++) {
		    formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
		}
		this.imagesService.addImages(formData)
	      .subscribe(images => {
	      	for(let i =0; i< images.length; i++){
	      		this.images.push({path: images[i].path, filename: images[i].filename});
	      	}
	        this.images.concat(images);
	        this.urls = [];
	        this.uploadedFiles = []
	      });
	}

	removeFile(imageName){
		this.urls = this.urls.filter(function(data){
			return data.name != imageName;
		});
		this.uploadedFiles = this.uploadedFiles.filter(function(data){
			return data.name != imageName;
		})
	}

}

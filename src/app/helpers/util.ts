export class Util{
    formatDate(input: any): string  {
        var datePart = input.match(/\d+/g),
        year = datePart[0].substring(0), // get only two digits
        month = datePart[1], day = datePart[2];
      
        return day+'/'+month+'/'+year;
      }

    onlyNumberKey(event) {
        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
    }
    onlyAlphabetKey(event) {
        return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123);
    }

    convertDateIntoDMYHMS(date) {
        const array = date.split('T')
        const d = array[0].split('-').reverse().join('-')
        const t = array[1].split('.')
        return d + ' ' + t[0];
    }

    getExtension(filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
    }
    
    isImage(filename) {
        var ext = this.getExtension(filename);
        switch (ext.toLowerCase()) {
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
            //etc
            return true;
        }
        return false;
    }
    
    isVideo(filename) {
        var ext = this.getExtension(filename);
        switch (ext.toLowerCase()) {
        case 'm4v':
        case 'avi':
        case 'mpg':
        case 'mp4':
            // etc
            return true;
        }
        return false;
    }

    isAudio(filename) {
        var ext = this.getExtension(filename);
        switch (ext.toLowerCase()) {
        case 'wav':
        case 'mp3':
        case 'ogg':
        case 'aiff':
            return true;
        }
        return false;
    }

    getMimeType(file) {
        var mimetype;
        if (this.isImage(file.name)) {
            mimetype='image';
        }
        else if (this.isVideo(file.name)) {
            mimetype='video';
        }
        else if (this.isAudio(file.name)) {
            mimetype='audio';
        }
		else
		{
			mimetype='raw';
        }
        return mimetype
    }

    limitToText(string, length) {
        if(string.length > length) {
            return string.slice(0, length) + '...'
        } else {
            return string
        }
    }

    onlyAlphabetKeyWithDot(event) {
        return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || event.charCode === 46;
    }
}
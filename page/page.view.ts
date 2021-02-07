namespace $.$$ {
	
	export class $hyoo_slides_page extends $.$hyoo_slides_page {
		
		uri_page() {
			return this.uri_base() + `#slide=${ this.slide() }`
		}
		
		pages() {
			return [
				... this.role() === 'listener' ? [] : [ this.Speaker() ],
				this.Listener(),
			]
		}
		
	}
	
}

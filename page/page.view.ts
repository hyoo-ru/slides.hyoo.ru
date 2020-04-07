namespace $.$$ {
	
	export class $hyoo_slides_page extends $.$hyoo_slides_page {
		
		sub() {
			const role = this.role()
			return [
				this.Listener() ,
				... ( role === 'listener' ) ? [] : [ this.Speaker() ] ,
			]
		}

		uri_page() {
			return this.uri_base() + `#slide=${ this.slide() }`
		}
		
	}
	
}

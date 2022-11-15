namespace $.$$ {
	
	export class $hyoo_slides extends $.$hyoo_slides {
		
		sub() {
			
			if( !this.uri_slides() ) {
				return [ this.Menu() ]
			}

			return [
				this.Loader() ,
				... this.$.$mol_print.active()
					? $mol_range2(
						index => this.Page( index ) ,
						()=> this.slide_keys().length ,
					)
					: [ this.Page( this.slide() ) ]
			]
				
		}
		
		uri_base() {
			return this.uri_slides().replace( /[^/]*$/ , '' )
		}
		
		@ $mol_mem
		menu_items() {
			return Object.keys( this.menu_options() ).map( uri => this.Menu_item( uri ) )
		}
		
		menu_item_uri( uri: string ) {
			return uri
		}
		
		menu_item_title( uri: string ) {
			return this.menu_options()[ uri ]
		}
		
		@ $mol_mem
		contents( next = '' ) {
			if( !this.uri_slides() ) return ''
			this.Loader().window()
			return next
		}
		
		@ $mol_mem
		message_listener() {

			return new $mol_dom_listener(
				$mol_dom_context,
				'message',
				$mol_wire_async( ( event: MessageEvent< any > )=> {
					
					const data = event.data
					if( !Array.isArray( data ) ) return
					if( data[0] !== 'done' ) return
					
					this.contents( data[1] )
					
				} )
			)
			
		}
		
		@ $mol_mem
		content_pages() {
			return this.contents().split( /^(?=#)/mg ) as string[]
		}
		
		@ $mol_mem_key
		page_tokens( index : number ) {
			const tokens = [] as { name : string , found : string , chunks: string[] }[]
			this.$.$mol_syntax2_md_flow.tokenize(
				this.content_pages()[ index ] || '',
				( name , found , chunks )=> tokens.push({ name , found , chunks }),
			)
			return tokens as Readonly< typeof tokens >
		}
		
		@ $mol_mem_key
		page_title( index : number ) {

			for( let token of this.page_tokens( index ) ) {
				if( token.name === 'header' ) return token.chunks[2]
			}

			return ''
		}

		@ $mol_mem
		title() {
			return this.page_title( this.slide() ) || super.title()
		}

		@ $mol_mem_key
		speaker_content( index : number ) {
			return this.page_tokens( index ).filter( token => {
				if( token.name === 'header' ) return false
				if( token.name !== 'block' ) return false
				if( '!['.indexOf( token.found[0] ) >= 0 ) return false
				return true
			} )
		}
		
		@ $mol_mem_key
		listener_content( index : number ) {
			return this.page_tokens( index ).filter( token => {
				if( token.name === 'header' ) return false
				if( token.name !== 'block' ) return true
				if( '!['.indexOf( token.found[0] ) >= 0 ) return true
				return false
			} )
		}
		
		@ $mol_mem
		slide( next? : number ) {
			
			if( next !== undefined ) {

				const count = this.content_pages().length
				
				if( next >= count ) next = count - 1
				if( next < 0 ) next = 0

			}
			
			const local = $mol_state_local.value( `slide(${ JSON.stringify( this.uri_slides() ) })`, next )
			const arg = $mol_state_arg.value( 'slide', next?.valueOf && String( next ) )
			
			return ( local ?? Number( arg ) ) || 0
		}

		page_slide( index : number , next? : number ) {
			if( next !== undefined ) this.slide( next )
			return index
		}

		@ $mol_mem
		slide_keys() {
			return this.content_pages().map( ( _ , index )=> index )
		}
		
		role( next? : 'speaker' | 'listener' ) {
			return $mol_state_arg.value( this.state_key( 'role' ) , next ) || 'speaker'
		}
		
		uri_slides() {
			return $mol_state_arg.value( this.state_key( 'slides' ) ) ?? ''
		}
		
		event_next( next? : Event ) {
			this.slide( this.slide() + 1 )
		}
		
		event_prev( next? : Event ) {
			this.slide( this.slide() - 1 )
		}
		
		event_start( next? : Event ) {
			this.slide( 0 )
		}
		
		event_end( next? : Event ) {
			this.slide( this.content_pages().length  - 1 )
		}
		
		event_slide( [ numb ] : [ string ] ) {
			this.slide( Number( numb ) )
		}
		
		event_about( [ topic ] : [ string ] ) {
			let matcher = topic
			const pages = this.content_pages()
			
			while( matcher.length > 2 ) {
				
				for( let i = 0 ; i < pages.length ; ++i ) {

					if( !pages[i]!.toLowerCase().match( matcher ) ) continue
					
					this.slide( i )
					return
				}
				
				matcher = matcher.substring( 0 , matcher.length - 1 )
			}
			
			matcher = topic
			while( matcher.length > 2 ) {
				
				for( let i = 0 ; i < pages.length ; ++i ) {

					if( !pages[i].toLowerCase().match( matcher ) ) continue
					
					this.slide( i )
					return
				}
				
				matcher = matcher.substring( 0 , matcher.length - 1 )
			}

		}
		
		event_repeat( next? : Event ) {
			const commands = $mol_speech.commands()
			const command = commands[ commands.length - 2 ]
			if( command ) $mol_speech.say( command )
		}
		
		event_speech_on( next? : Event ) {
			$mol_speech.speaking( true )
		}
		
		event_speech_off( next? : Event ) {
			$mol_speech.speaking( false )
		}
		
		event_sing() {
			this.$.$mol_speech.say( 'Не хочу! Не буду!' )
		}

		speech_enabled( next? : boolean ) {
			return $mol_speech.hearing( next )
		}

		speech_text() {
			const commands = $mol_speech.commands()
			return commands.length && commands[ commands.length - 1 ] || ''
		}

		@ $mol_mem
		lights( next? : boolean ) {
			return this.$.$mol_lights( next )
		}

		event_lights_toggle() {
			this.lights( !this.lights() )
		}
		
		@ $mol_mem
		timings() {
			return this.content_pages().map( page => page.length )
		}
		
		@ $mol_mem
		timing_total() {
			return this.timings().slice( 1 ).reduce( ( a , b )=> a + b , 0 )
		}
		
		@ $mol_mem_key
		progress( index : number ) {
			const timing = this.timings().slice( 1 , index + 1 ).reduce( ( a , b )=> a + b , 0 )
			return timing / this.timing_total()
		}

		@ $mol_mem
		speech_next_auto() {
			
			const texts = this.speaker_content( this.slide() )
			if( texts.length === 0 ) return []

			const found = /[\s\S]*\s([a-zа-яё]+)[^a-zа-яё]*?/ui.exec( texts[ texts.length - 1 ].found )
			if( !found ) return []

			const suffix = found[1].replace( /(.)$/ , '$1?' )

			return [ suffix ]

		}
		
	}
	
}

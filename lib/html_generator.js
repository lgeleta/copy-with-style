'use babel';

import Editor from './atom_editor';

import { Color, rgba2rgb } from './color';
import { getTextNodesIn } from './node_manipulation';


export default class HTMLgenerator {
  constructor( config, callback ){
    this.config = config;
    this.callback = callback;
    this.background_color = new Color( this.config.background_color );

    this.html = '<code style="'+ this.create_code_block_style() +'">';
  }

  style_node( node ){
    var style, color, css;

    if( !node.data ){ return; }

    style = window.getComputedStyle( node.parentElement );
    color = new Color( style.color ).rgba2rgb( this.background_color );
    css = 'color:' + color.rgb() + ';';
    if( style.fontWeight === 'bold' ){ css += 'font-weight:blod;'; }
    if( style.textDecoration === 'underline' ){ css += 'text-decoration:underline;'; }
    if( style.fontStyle === 'italic' ){ css += 'font-style:italic;'; }

    return '<span style="'+css+'">'+node.data+'</span>';;
  }

  create_code_block_style(){
    var font_family, font_size, css;

    font_family = this.config.font_family;
    font_size = this.config.font_size;

    css =  'background-color:'+ this.background_color.hex() +';';
    css += 'font-family:\''+ font_family +'\';';
    css += 'font-size:'+ font_size +'pt;';

    return css;
  }

  generate_line( line ){
    this.html += '<span style="display:inline-block;" class="line">'
    this.html += getTextNodesIn( line ).map( this.style_node.bind( this )).join('');
    this.html += '</span><br/>\n';
  }

  finalize(){
    this.html = this.html.trim() + '</code>';
    this.callback( this.html );
  }

  generate(){
    new Editor( this.finalize.bind( this )).process_lines( this.generate_line.bind( this ));
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import { DateTime } from 'luxon';

export default class DateInput extends Component {
    static propTypes = {
        format: PropTypes.string,
        value: PropTypes.instanceOf(DateTime),
        onChange: PropTypes.func.isRequired,
        masked: PropTypes.bool
    };

    static defaultProps = {
        format: 'dd-LL-yyyy',
    };

    toMask(format) {
        // let arr = format.split("").map(c=> c.replace(/[\W_]+/g, placeChar));
        // map(c => c.replace(/\w/, new RegExp('\\d')));
        // return format.split("").map(c => c.replace(/\w/ , new RegExp('\\d')));
        let arr = format.split("");
        for(let i=0; i<arr.length;i++){
            if(arr[i].match(/\w/)){
                arr[i] = new RegExp('\\d');
            }
        }
        return arr;
    }

    formatToMask(s, index, mask, placeChar){
        if(!!!s) return "";
        let formatted = s.split("").slice(0,index);
        console.log(formatted);
        for(let i=index; i<mask.length; i++){
            if(typeof(mask[i]) === 'string'){
                formatted.push(mask[i]);
            }else {
                formatted.push(placeChar);
            }
        }
        return formatted.join("");
    }

    state = { value: null, typeValue: null };

    constructor(...args) {
        super(...args);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onChange(e, { value }) {
        const { format, onChange, masked } = this.props;
        let mask  = !!this.props.mask ? this.props.mask : this.toMask(format) ;
        let placeChar = !!this.props.placeholderChar ? this.props.placeholderChar : '_';
        let cleanValue = value.slice(0, mask.length);

        // console.log(placeChar);

        let lastIndex = cleanValue.length;
        let carretPosition = cleanValue.length;

        if(!!masked){
            // console.log(mask);
            // console.log(cleanValue);            
            for(let i=0; i<cleanValue.length; i++){
                // let lastIndex = 0;
                if(!!!cleanValue[i].match(mask[i]) && cleanValue[i] !== placeChar){
                // if(!mask[i].test(cleanValue[i])){  
                    console.log("matches until "+i);
                    // lastIndex = i;
                    lastIndex = i;
                    break;
                }
                // console.log(value[i].match(mask[i]));
            }

            // e.target.selectionStart = 2;
            // console.log(e.target.selectionStart);
            cleanValue = this.formatToMask(cleanValue, lastIndex, mask, placeChar);
            // const cleanValue = value.replace
            // mask = this.toMask(format,'+');
        }
        // console.log("state= ", cleanValue);
        
        // console.log(e.target.selectionStart);
        // e.target.selectionStart = 1;
        // e.target.selectionEnd = 1;
        // e.target.setSelectionRange(1,1);
        this.setState({ typeValue: cleanValue});

        window.requestAnimationFrame(() => {
            console.log(e);
            // e.target.selectionStart = 1
            // e.target.selectionEnd = 1
          })

        const date = DateTime.fromFormat(cleanValue, format);
        if (!date.invalid) {
            onChange(date);
        }
    }

    onBlur(...args) {
        const { onBlur } = this.props;
        this.setState({ typeValue: null });
        if (onBlur) {
            onBlur(...args);
        }
    }

    render() {
        const { typeValue } = this.state; 
        const { format, value, masked, ...props } = this.props;

        delete props.onChange;
        delete props.onBlur;

        return (
            <Input
                value={
                    typeValue !== null
                    ? typeValue
                    : value
                    ? value.toFormat(format)
                    : ''
                }
                onChange={this.onChange}
                onBlur={this.onBlur}
                {...props}
            />
        );
    }
}

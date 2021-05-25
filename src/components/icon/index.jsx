
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'YlIcon',
    props: {
        icon: {
            type: String,
            required: false
        },
        className: {
            type: String,
            default: ''
        }
    },
    setup (prop) {
        let iconName = `#${prop.icon || prop.className}`;
        let svgClass;
        if (prop.className) {
            svgClass = 'yl-icon ' + prop.className;
        } else {
            svgClass = 'yl-icon';
        }
        return () =>  (
            <svg class={svgClass} aria-hidden="true">
                <use xlink:href={iconName}></use>
            </svg>
        ); 
    }
});

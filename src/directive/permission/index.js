import hasPerm from "./hasPerm";
import hasRole from "./hasRole";

const install = function (Vue) {
    Vue.directive('hasRole', hasRole);
    Vue.directive('hasPerm', hasPerm)
};

if (window.Vue) {
    window['hasRole'] = hasRole;
    window['hasPerm'] = hasPerm;
    Vue.use(install); // eslint-disable-line
}

export default install
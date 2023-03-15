import { ThemeClasses } from '@redeye/ui-styles';
import { computed } from 'mobx';
import { Model, model, modelAction, prop } from 'mobx-keystone';
import { computedFn } from 'mobx-utils';
import type { Moment, MomentInput } from 'moment-timezone';
import moment from 'moment-timezone';

export const defaultTimeZone = moment.tz.guess();

export type UiTheme = 'light' | 'dark' | 'system';

const defaultTheme: UiTheme = 'dark';
const getAppTheme = () => (window.localStorage.getItem('theme') as UiTheme) || (defaultTheme as UiTheme);

@model('Settings')
export class Settings extends Model({
	showHidden: prop<boolean>(window.localStorage.getItem('showHidden') === 'true'),
	timezone: prop<string>(window.localStorage.getItem('timezone') || defaultTimeZone),
	theme: prop<UiTheme>(getAppTheme()),
}) {
	@modelAction setShowHidden(showHidden: boolean) {
		this.showHidden = showHidden;
		window.localStorage.setItem('showHidden', showHidden.toString());
	}
	@modelAction setTimezone(tz: string) {
		this.timezone = tz;
		window.localStorage.setItem('timezone', tz);
	}
	@modelAction setTheme(th: UiTheme) {
		this.theme = th;
		updateAppTheme(th);
		window.localStorage.setItem('theme', th);
	}
	@modelAction setDefaultTimezone() {
		this.setTimezone(defaultTimeZone);
	}
	@computed get isDefaultTimezone() {
		return this.timezone === defaultTimeZone;
	}
	momentTz = computedFn((d: MomentInput | Moment) => moment(d).tz(this.timezone));
}

// @Austin, does this belong here?
export const updateAppTheme = (theme?: UiTheme) => {
	theme = theme || getAppTheme();
	const rootClassList = document.documentElement.classList;
	if (theme === 'system') {
		// TODO: query the system theme somehow?
		theme = 'dark';
	}
	if (theme === 'dark') {
		rootClassList.remove(ThemeClasses.LIGHT);
		rootClassList.add(ThemeClasses.DARK);
	} else if (theme === 'light') {
		rootClassList.remove(ThemeClasses.DARK);
		rootClassList.add(ThemeClasses.LIGHT);
	}
};

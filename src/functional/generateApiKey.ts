import md5 from 'md5';

// APIを指定.
export const generateApiKey = {
	_date: new Date(),
	_format(n: number): string {
		return n < 10 ? '0' + n : n.toString();
	},
	year(): string {
		return this._date.getFullYear().toString();
	},
	month(): string {
		return this._format(this._date.getMonth() + 1);
	},
	day(): string {
		return this._format(this._date.getDate());
	},
	hour(): string {
		return this._format(this._date.getHours());
	},
	min(): string {
		return this._format(this._date.getMinutes());
	},
	url(API_URL: string, API_KEY: string, API_SALT = ''): string {
		if (API_SALT) {
			return `${API_URL}?key=${md5(
				this.year() +
          this.month() +
          this.day() +
          this.hour() +
          this.min() +
          API_KEY +
          API_SALT
			)}`;
		}
		return `${API_URL}?key=${API_KEY}`;
	},
};

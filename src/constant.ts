namespace constant {
    // Notion
    export const notion = {
        url: {
            base: 'https://api.notion.com/v1',
            get database() { return `${this.base}/databases`},
            get page() {return `${this.base}/pages`},
            get user() {return `${this.base}/users`},
            get bot() {return `${this.user}/me`}
        },
    } as const;
    /** job interval in milliseconds */
    export const interval = 1000 * 60 * 60;
    /**  */
}
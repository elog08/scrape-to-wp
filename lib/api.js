/* 
 *  Wrapper around WP-API
 */
const env = require('../env');
const WPAPI = require('wpapi');

class API {
    constructor () {
        this.wp = null;
        this.user = null;
    }
    
    addPost(title, content, category, meta, type='posts', status='draft') {  
        return new Promise((resolve, reject) => {
            this.wp.posts().create({
                title,
                content,
                status
            }).then(function( response ) {
                resolve(response.id);
            }, reject);
        });
    }
    
    addPage(title, content, category, meta, type='posts', status='draft') {  
        return new Promise((resolve, reject) => {
            this.wp.pages().create({
                title,
                content,
                status
            }).then(function( response ) {
                resolve(response.id);
            }, reject);
        });
    }
    
    initialize() {
        return new Promise((resolve, reject) => {
            if (!this.wp)
            {
                let config = {
                    endpoint: `${env.WP_URL}/wp-json`,
                    username: env.WP_USERNAME,
                    password: env.WP_PASSWORD,
                    auth: true
                }
                
                this.wp = new WPAPI(config)
                
                // Verify that it authenticated
                this.wp.users().me().then((user) => {
                    this.user = user;
                    console.log('API', 'authenticated as', user.name);
                    resolve(user);
                }, (error) => reject(error))
            }
            else
            {
                reject ("API already initialized");
            }
        });
    }
}

module.exports = { API };
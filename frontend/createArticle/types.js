/**
 * @class Article
 */
export class Article 
{
    /**
     * @constructs Article
     * @param {Object} p The article's property object.
     * @param {String} p.title The article title. 
     * @param {String} p.author The article author.
     * @param {Number} p.year The article year.
     * @param {String} p.body The article body.
     * @param {String} p.subtitle The article subtitle.
     * @param {Uint8Array} image The article's attached image.
     */
    constructor(p={}) 
    {
        this.title = p.title;
        this.author = p.author;
        this.year = p.year;
        this.body = p.body;
        this.image = p.image;
        this.subtitle = p.subtitle;
    }
}

/**
 * @class Paper
 */
export class Paper 
{
    /**
    * @constructs Paper
    * @param {Object} p The property object for the paper.
    * @param {String}  p.headline The paper's main headline.
    * @param {Article} p.centerArticle The highlight article.
    * @param {Article} p.leftArticle The left article on the front.
    * @param {Article} p.rightArticle The right article on the front. 
    * @param {Number} p.issue The issue number of the article.
    * @param {String} p.date The date of the article.
    */
   constructor(p={})
   {
        this.headline = p.headline;
        this.centerArticle = p.centerArticle;
        this.leftArticle = p.leftArticle;
        this.rightArticle = p.rightArticle;
        this.issue = p.issue;
        this.date = p.date;
   }
}

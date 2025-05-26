// src/model/fragment.js

// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const logger = require('../logger');

const md = require('markdown-it')({
  html: true,
});

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    //throw if values are invalid(for ownerID, type and size) or assign a default value if empty(for id, created and updated)
    logger.debug('Fragment Constructor with values', { id, ownerId, created, updated, type, size });

    this.id = id || randomUUID();

    if (!ownerId) {
      throw new Error(`ownerId is required, got ownerId=${ownerId}`);
    } else {
      this.ownerId = ownerId;
    }

    if (!created) {
      this.created = new Date().toISOString();
    } else {
      this.created = created;
    }

    if (!updated) {
      this.updated = new Date().toISOString();
    } else {
      this.updated = updated;
    }

    if (!type) {
      throw new Error(`type is required, got type=${type}`); //throw if type is empty
    } else {
      if (!Fragment.isSupportedType(type)) {
        throw new Error(`type is not supported type, got type=${type}`); //throw if type is not a supported type, for now limited to text-plain
      }
      this.type = type;
    }

    if (size < 0 || typeof size === 'string') {
      throw new Error(`size needs to be positive integer, got size=${size}`);
    } else {
      this.size = size;
    }
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    logger.debug('entering byUser() with parameters: ', { ownerId, expand });
    try {
      const frgmt = await listFragments(ownerId, expand);
      if (!expand) {
        return frgmt;
      } else {
        return frgmt.map((fragment) => new Fragment(fragment));
      }
    } catch (error) {
      return [];
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    logger.debug('entering byId() with parameters: ', { ownerId, id });
    try {
      const frgmt = await readFragment(ownerId, id);
      return new Fragment(frgmt);
    } catch (error) {
      console.log('error fetching by id: ', error);
      throw new Error(`fragment with ownerId:${ownerId} and id:${id} could not be read`);
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    logger.debug('entering delete() with parameters: ', { ownerId, id });
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    try {
      logger.info('entering save()');
      this.updated = new Date().toISOString();
      return writeFragment(this);
    } catch (err) {
      throw new Error('Unable to save the current fragment to the database');
    }
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    try {
      logger.info('entering getData()');
      return await readFragmentData(this.ownerId, this.id);
    } catch (err) {
      throw new Error('Unable to get fragment data');
    }
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    logger.debug('entering setData() with ', { data });
    try {
      if (data) {
        this.updated = new Date().toISOString();
        this.size = data.length;
        await writeFragment(this);
        await this.save();
        return writeFragmentData(this.ownerId, this.id, data);
      } else {
        return Promise.reject(new Error('Data could not be set, can not be empty'));
      }
    } catch (error) {
      console.log('error updating memory DB: ', error);
      return Promise.reject(error);
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    logger.info('entering isText()');
    return this.mimeType.startsWith('text');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    logger.info('entering formats()');
    if (this.mimeType === 'text/plain') {
      return ['text/plain'];
    } else if (this.mimeType === 'text/markdown') {
      return ['text/plain', 'text/html', 'text/markdown'];
    } else if (this.mimeType === 'text/html') {
      return ['text/plain', 'text/html'];
    } else if (this.mimeType === 'application/json') {
      return ['text/plain', 'application/json'];
    } else if (this.mimeType === 'image/png') {
      return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    } else if (this.mimeType === 'image/jpeg') {
      return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    } else if (this.mimeType === 'image/webp') {
      return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    } else if (this.mimeType === 'image/gif') {
      return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    } else {
      return [];
    }
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    logger.debug('entering isSupportedType() with parameter ', { value });
    return [
      'text/plain',
      'text/plain; charset=utf-8',
      'text/markdown',
      'text/html',
      'application/json',
      'application/json; charset=utf-8',
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif',
    ].includes(value);
  }

  /**
   * Returns the type converted data
   */
  convertToSupportedType(data, type) {
    console.log("Entering convertToSupportedType with data" + data + " and type " + type)
    const formats = this.formats;
    if (!formats.includes(type)) throw new Error('provided type is not supported type');
    //if (this.mimeType == 'text/markdown' && type == 'text/html') {
      return md.render(data);
    //}
  }
}

module.exports.Fragment = Fragment;
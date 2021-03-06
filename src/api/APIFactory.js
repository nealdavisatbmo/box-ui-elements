/**
 * @flow
 * @file Main entry point for the box api
 * @author Box
 */

import Cache from '../util/Cache';
import ChunkedUploadAPI from './uploads/MultiputUpload';
import PlainUploadAPI from './uploads/PlainUpload';
import FolderAPI from './Folder';
import FileAPI from './File';
import WebLinkAPI from './WebLink';
import SearchAPI from './Search';
import RecentsAPI from './Recents';
import VersionsAPI from './Versions';
import CommentsAPI from './Comments';
import TasksAPI from './Tasks';
import TaskAssignmentsAPI from './TaskAssignments';
import FileAccessStatsAPI from './FileAccessStats';
import UsersAPI from './Users';
import MetadataAPI from './Metadata';
import FileCollaboratorsAPI from './FileCollaborators';
import { DEFAULT_HOSTNAME_API, DEFAULT_HOSTNAME_UPLOAD, TYPE_FOLDER, TYPE_FILE, TYPE_WEBLINK } from '../constants';

class APIFactory {
    /**
     * @property {*}
     */
    options: Options;

    /**
     * @property {FileAPI}
     */
    fileAPI: FileAPI;

    /**
     * @property {WebLink}
     */
    weblinkAPI: WebLinkAPI;

    /**
     * @property {FolderAPI}
     */
    folderAPI: FolderAPI;

    /**
     * @property {PlainUploadAPI}
     */
    plainUploadAPI: PlainUploadAPI;

    /**
     * @property {ChunkedUploadAPI}
     */
    chunkedUploadAPI: ChunkedUploadAPI;

    /**
     * @property {SearchAPI}
     */
    searchAPI: SearchAPI;

    /**
     * @property {RecentsAPI}
     */
    recentsAPI: RecentsAPI;

    /**
     * @property {VersionsAPI}
     */
    versionsAPI: VersionsAPI;

    /**
     * @property {CommentsAPI}
     */
    commentsAPI: CommentsAPI;

    /**
     * @property {TasksAPI}
     */
    tasksAPI: TasksAPI;

    /**
     * @property {TaskAssignmentsAPI}
     */
    taskAssignmentsAPI: TaskAssignmentsAPI;

    /*
     * @property {FileAccessStatsAPI}
     */
    fileAccessStatsAPI: FileAccessStatsAPI;

    /*
     * @property {UsersAPI}
     */
    usersAPI: UsersAPI;

    /*
     * @property {MetadataAPI}
     */
    metadataAPI: MetadataAPI;

    /**
     * @property {FileCollaboratorsAPI}
     */
    fileCollaboratorsAPI: FileCollaboratorsAPI;

    /**
     * [constructor]
     *
     * @param {Object} options
     * @param {string} options.id - item id
     * @param {string|function} options.token - Auth token
     * @param {string} [options.sharedLink] - Shared link
     * @param {string} [options.sharedLinkPassword] - Shared link password
     * @param {string} [options.apiHost] - Api host
     * @param {string} [options.uploadHost] - Upload host name
     * @return {API} Api instance
     */
    constructor(options: Options) {
        this.options = Object.assign({}, options, {
            apiHost: options.apiHost || DEFAULT_HOSTNAME_API,
            uploadHost: options.uploadHost || DEFAULT_HOSTNAME_UPLOAD,
            cache: options.cache || new Cache()
        });
    }

    /**
     * [destructor]
     *
     * @param {boolean} destroyCache - true to destroy cache
     * @return {void}
     */
    destroy(destroyCache: boolean = false) {
        if (this.fileAPI) {
            this.fileAPI.destroy();
            delete this.fileAPI;
        }

        if (this.weblinkAPI) {
            this.weblinkAPI.destroy();
            delete this.weblinkAPI;
        }

        if (this.plainUploadAPI) {
            this.plainUploadAPI.destroy();
            delete this.plainUploadAPI;
        }

        if (this.chunkedUploadAPI) {
            this.chunkedUploadAPI.destroy();
            delete this.chunkedUploadAPI;
        }

        if (this.folderAPI) {
            this.folderAPI.destroy();
            delete this.folderAPI;
        }

        if (this.searchAPI) {
            this.searchAPI.destroy();
            delete this.searchAPI;
        }

        if (this.recentsAPI) {
            this.recentsAPI.destroy();
            delete this.recentsAPI;
        }

        if (this.versionsAPI) {
            this.versionsAPI.destroy();
            delete this.versionsAPI;
        }

        if (this.fileAccessStatsAPI) {
            this.fileAccessStatsAPI.destroy();
            delete this.fileAccessStatsAPI;
        }

        if (this.tasksAPI) {
            this.tasksAPI.destroy();
            delete this.tasksAPI;
        }

        if (this.commentsAPI) {
            this.commentsAPI.destroy();
            delete this.commentsAPI;
        }

        if (this.usersAPI) {
            this.usersAPI.destroy();
            delete this.usersAPI;
        }

        if (this.metadataAPI) {
            this.metadataAPI.destroy();
            delete this.metadataAPI;
        }

        if (this.fileCollaboratorsAPI) {
            this.fileCollaboratorsAPI.destroy();
            delete this.fileCollaboratorsAPI;
        }

        if (destroyCache) {
            this.options.cache = new Cache();
        }
    }

    /**
     * Gets the cache instance
     *
     * @return {Cache} cache instance
     */
    getCache(): APICache {
        return ((this.options.cache: any): APICache);
    }

    /**
     * Returns the API based on type of item
     *
     * @private
     * @param {String} type - item type
     * @return {ItemAPI} api
     */
    getAPI(type: ItemType): ItemAPI {
        let api: ItemAPI;

        switch (type) {
            case TYPE_FOLDER:
                api = this.getFolderAPI();
                break;
            case TYPE_FILE:
                api = this.getFileAPI();
                break;
            case TYPE_WEBLINK:
                api = this.getWebLinkAPI();
                break;
            default:
                throw new Error('Unknown Type!');
        }

        return api;
    }

    /**
     * API for file
     *
     * @return {FileAPI} FileAPI instance
     */
    getFileAPI(): FileAPI {
        this.destroy();
        this.fileAPI = new FileAPI(this.options);
        return this.fileAPI;
    }

    /**
     * API for web links
     *
     * @return {WebLinkAPI} WebLinkAPI instance
     */
    getWebLinkAPI(): WebLinkAPI {
        this.destroy();
        this.weblinkAPI = new WebLinkAPI(this.options);
        return this.weblinkAPI;
    }

    /**
     * API for plain uploads
     *
     * @return {UploadAPI} UploadAPI instance
     */
    getPlainUploadAPI(): PlainUploadAPI {
        this.destroy();
        this.plainUploadAPI = new PlainUploadAPI(this.options);
        return this.plainUploadAPI;
    }

    /**
     * API for chunked uploads
     *
     * @return {UploadAPI} UploadAPI instance
     */
    getChunkedUploadAPI(): ChunkedUploadAPI {
        this.destroy();
        this.chunkedUploadAPI = new ChunkedUploadAPI(this.options);
        return this.chunkedUploadAPI;
    }

    /**
     * API for folder
     *
     * @return {FolderAPI} FolderAPI instance
     */
    getFolderAPI(): FolderAPI {
        this.destroy();
        this.folderAPI = new FolderAPI(this.options);
        return this.folderAPI;
    }

    /**
     * API for search
     *
     * @return {SearchAPI} SearchAPI instance
     */
    getSearchAPI(): SearchAPI {
        this.destroy();
        this.searchAPI = new SearchAPI(this.options);
        return this.searchAPI;
    }

    /**
     * API for recents
     *
     * @return {RecentsAPI} RecentsAPI instance
     */
    getRecentsAPI(): RecentsAPI {
        this.destroy();
        this.recentsAPI = new RecentsAPI(this.options);
        return this.recentsAPI;
    }

    /**
     * API for metadata
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {MetadataAPI} MetadataAPI instance
     */
    getMetadataAPI(shouldDestroy: boolean): MetadataAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.metadataAPI = new MetadataAPI(this.options);
        return this.metadataAPI;
    }

    /**
     * API for versions
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {VersionsAPI} VersionsAPI instance
     */
    getVersionsAPI(shouldDestroy: boolean): VersionsAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.versionsAPI = new VersionsAPI(this.options);
        return this.versionsAPI;
    }

    /**
     * API for comments
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {CommentsAPI} CommentsAPI instance
     */
    getCommentsAPI(shouldDestroy: boolean): CommentsAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.commentsAPI = new CommentsAPI(this.options);
        return this.commentsAPI;
    }

    /**
     * API for tasks
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {TasksAPI} TasksAPI instance
     */
    getTasksAPI(shouldDestroy: boolean): TasksAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.tasksAPI = new TasksAPI(this.options);
        return this.tasksAPI;
    }

    /**
     * API for tasks
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {TasksAPI} TaskAssignmentsAPI instance
     */
    getTaskAssignmentsAPI(shouldDestroy: boolean): TaskAssignmentsAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.taskAssignmentsAPI = new TaskAssignmentsAPI(this.options);
        return this.taskAssignmentsAPI;
    }

    /*
     * API for file access stats
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {FileAccessStatsAPI} FileAccessStatsAPI instance
     */
    getFileAccessStatsAPI(shouldDestroy: boolean): FileAccessStatsAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.fileAccessStatsAPI = new FileAccessStatsAPI(this.options);
        return this.fileAccessStatsAPI;
    }

    /*
     * API for file collaborators
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {FileCollaboratorsAPI} FileCollaboratorsAPI instance
     */
    getFileCollaboratorsAPI(shouldDestroy: boolean): FileCollaboratorsAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.fileCollaboratorsAPI = new FileCollaboratorsAPI(this.options);
        return this.fileCollaboratorsAPI;
    }

    /*
     * API for Users
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {UsersAPI} UsersAPI instance
     */
    getUsersAPI(shouldDestroy: boolean): UsersAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.usersAPI = new UsersAPI(this.options);
        return this.usersAPI;
    }
}

export default APIFactory;

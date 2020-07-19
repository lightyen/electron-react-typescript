declare module "level-rocksdb" {
	import type { Readable } from "stream"
	type KeyType = string | Buffer
	type ValueType = KeyType
	type ErrorCallback = (err: Error | undefined) => void
	type ErrorValueCallback = (err: Error | undefined, value: KeyType) => void
	type ErrorDBCallback = (err: Error | undefined, db: LevelRocksDB) => void
	type ErrorSizeCallback = (err: Error | undefined, size: number) => void

	interface PutBatch {
		readonly type?: "put"
		readonly key: KeyType
		readonly value: ValueType
	}
	interface DelBatch {
		readonly type: "del"
		readonly key: ValueType
	}
	type AbstractBatch = PutBatch | DelBatch

	interface AbstractChainedBatch {
		/**
		 * Queue a put operation on the current batch, not committed until a `write()` is called on the batch.
		 *
		 * This method may `throw` a `WriteError` if there is a problem with your put (such as the `value` being `null` or `undefined`).
		 */
		put: (key: KeyType, value: ValueType) => this

		/**
		 * Queue a del operation on the current batch, not committed until a `write()` is called on the batch.
		 *
		 * This method may `throw` a `WriteError` if there is a problem with your delete.
		 */
		del: (key: KeyType) => this

		/** Clear all queued operations on the current batch, any previous operations will be discarded. */
		clear: () => this

		/** The number of queued operations on the current batch. */
		length: number

		/**
		 * Commit the queued operations for this batch. All operations not *cleared* will be written to the underlying store atomically, that is, they will either all succeed or fail with no partial commits.
		 *
		 * If no callback is passed, a promise is returned.
		 */
		write(): Promise<void>
		write(cb: ErrorCallback): void
	}

	interface GetOptions {
		/**
		 * Used to determine whether to return the `value` of the entry as a string or a Buffer. Note that converting from a Buffer to a string incurs a cost so if you need a string (and the `value` can legitimately become a UTF8 string) then you should fetch it as one with `{ asBuffer: false }` and you'll avoid this conversion cost.
		 * @default true
		 */
		asBuffer: boolean

		/**
		 * LevelDB will by default fill the in-memory LRU Cache with data from a call to get. Disabling this is done by setting `fillCache` to `false`.
		 * @default true
		 */
		fillCache: boolean
	}

	interface PutOptions {
		/** @default false */
		sync: boolean
	}

	interface DelOptions {
		/** @default false */
		sync: boolean
	}

	interface BatchOptions {
		/** @default false */
		sync: boolean
	}

	interface CreateReadStreamOptions {
		/** define the lower bound of the range to be streamed. Only entries where the key is greater than this option will be included in the range. When `reverse=true` the order will be reversed, but the entries streamed will be the same. */
		gt: KeyType

		/** define the lower bound of the range to be streamed. Only entries where the key is greater than (or equal to) this option will be included in the range. When `reverse=true` the order will be reversed, but the entries streamed will be the same. */
		gte: KeyType

		/** define the higher bound of the range to be streamed. Only entries where the key is less than this option will be included in the range. When `reverse=true` the order will be reversed, but the entries streamed will be the same. */
		lt: KeyType

		/** define the higher bound of the range to be streamed. Only entries where the key is less than (or equal to) this option will be included in the range. When `reverse=true` the order will be reversed, but the entries streamed will be the same. */
		lte: KeyType

		/**
		 * stream entries in reverse order. Beware that due to the way that stores like LevelDB work, a reverse seek can be slower than a forward seek.
		 * @default false
		 */
		reverse: boolean

		/**
		 * limit the number of entries collected by this stream. This number represents a maximum number of entries and may not be reached if you get to the end of the range first. A value of -1 means there is no limit. When `reverse=true` the entries with the highest keys will be returned instead of the lowest keys.
		 * @default -1
		 */
		limit: number

		/**
		 * whether the results should contain keys. If set to `true` and `values` set to `false` then results will simply be keys, rather than objects with a `key` property. Used internally by the `createKeyStream()` method.
		 * @default true
		 */
		keys: boolean

		/**
		 * whether the results should contain values. If set to `true` and `keys` set to `false` then results will simply be values, rather than objects with a `value` property. Used internally by the `createValueStream()` method.
		 * @default true
		 */
		values: boolean

		/** @deprecated instead use `gte` */
		start: KeyType
		/** @deprecated instead use `lte` */
		end: KeyType
	}
	type CreateKeyStreamOptions = Omit<CreateReadStreamOptions, "keys" | "values">
	type CreateValueStreamOptions = CreateKeyStreamOptions

	interface LevelRocksDB {
		iterator(): unknown

		supports: unknown

		/**
		 * Opens the underlying store. In general you should never need to call this method directly as it's automatically called by `levelup()`.
		 *
		 * However, it is possible to reopen the store after it has been closed with `close()`, although this is not generally advised.
		 *
		 * If no callback is passed, a promise is returned.
		 */
		open(callback: ErrorCallback): void
		open(): Promise<void>

		/**
		 * `close()` closes the underlying store. The callback will receive any error encountered during closing as the first argument.
		 *
		 * You should always clean up your `levelup` instance by calling `close()` when you no longer need it to free up resources. A store cannot be opened by multiple instances of `levelup` simultaneously.
		 *
		 * If no callback is passed, a promise is returned.
		 */
		close(callback: ErrorCallback): void
		close(): Promise<void>

		/**
		 * `get()` is the primary method for fetching data from the store. The `key` can be of any type. If it doesn't exist in the store then the callback or promise will receive an error. A not-found err object will be of type `'NotFoundError'` so you can `err.type == 'NotFoundError'` or you can perform a truthy test on the property `err.notFound.`
		 *
		 * ```ts
		 * db.get('foo', function (err, value) {
		 *   if (err) {
		 *     if (err.notFound) {
		 *       // handle a 'NotFoundError' here
		 *       return
		 *     }
		 *     // I/O or other error, pass it up the callback chain
		 *     return callback(err)
		 *   }
		 *
		 *   // .. handle `value` here
		 * })
		 * ```
		 * `options` is passed on to the underlying store.
		 *
		 * If no callback is passed, a promise is returned.
		 * */
		get(key: KeyType, options?: Partial<GetOptions>): Promise<ValueType>
		get(key: KeyType, callback: ErrorValueCallback): void
		get(key: KeyType, options: Partial<GetOptions>, callback: ErrorValueCallback): void

		/**
		 * `put()` is the primary method for inserting data into the store.
		 * Both key and value can be of any type as far as levelup is concerned.
		 */
		put(key: KeyType, value: ValueType, options?: Partial<PutOptions>): Promise<void>
		put(key: KeyType, value: ValueType, callback: ErrorCallback): void
		put(key: KeyType, value: ValueType, options: Partial<PutOptions>, callback: ErrorCallback): void

		/**
		 * `del()` is the primary method for removing data from the store.
		 *
		 * ```ts
		 * db.del('foo', function (err) {
		 *   if (err)
		 *   // handle I/O or other error
		 * });
		 * ```
		 * `options` is passed on to the underlying store.
		 *
		 * If no callback is passed, a promise is returned.
		 */
		del(key: KeyType, options?: Partial<DelOptions>): Promise<void>
		del(key: KeyType, callback: ErrorCallback): void
		del(key: KeyType, options: Partial<DelOptions>, callback: ErrorCallback): void

		/**
		 * `batch()` can be used for very fast bulk-write operations (both *put* and *delete*). The `array` argument should contain a list of operations to be executed sequentially, although as a whole they are performed as an atomic operation inside the underlying store.
		 *
		 * Each operation is contained in an object having the following properties: `type`, `key`, `value`, where the *type* is either `'put'` or `'del'`. In the case of `'del'` the `value` property is ignored. Any entries with a `key` of `null` or `undefined` will cause an error to be returned on the `callback` and any `type: 'put'` entry with a `value` of `null` or `undefined` will return an error.
		 *
		 * If `key` and `value` are defined but `type` is not, it will default to `'put'`.
		 *
		 * ```ts
		 * const ops = [
		 *   { type: 'del', key: 'father' },
		 *   { type: 'put', key: 'name', value: 'Yuri Irsenovich Kim' },
		 *   { type: 'put', key: 'dob', value: '16 February 1941' },
		 *   { type: 'put', key: 'spouse', value: 'Kim Young-sook' },
		 *   { type: 'put', key: 'occupation', value: 'Clown' }
		 * ]
		 *
		 * db.batch(ops, function (err) {
		 *   if (err) return console.log('Ooops!', err)
		 *   console.log('Great success dear leader!')
		 * })
		 * ```
		 * `options` is passed on to the underlying store.
		 *
		 * If no callback is passed, a promise is returned.
		 */
		batch(operations: AbstractBatch[]): Promise<AbstractChainedBatch>
		batch(operations: AbstractBatch[], callback: ErrorCallback): AbstractChainedBatch
		batch(
			operations: AbstractBatch[],
			options: Partial<BatchOptions>,
			callback: ErrorCallback,
		): AbstractChainedBatch

		/**
		 * `batch()`, when called with no arguments will return a `Batch` object which can be used to build, and eventually commit, an atomic batch operation. Depending on how it's used, it is possible to obtain greater performance when using the chained form of `batch()` over the array form.
		 *
		 * ```ts
		 * db.batch()
		 *   .del('father')
		 *   .put('name', 'Yuri Irsenovich Kim')
		 *   .put('dob', '16 February 1941')
		 *   .put('spouse', 'Kim Young-sook')
		 *   .put('occupation', 'Clown')
		 *   .write(function () { console.log('Done!') })
		 * ```
		 */
		batch(): AbstractChainedBatch

		/**
		 * A levelup instance can be in one of the following states:
		 *
		 * - *"new"* - newly created, not opened or closed
		 * - *"opening"* - waiting for the underlying store to be opened
		 * - *"open"* - successfully opened the store, available for use
		 * - *"closing"* - waiting for the store to be closed
		 * - *"closed"* - store has been successfully closed, should not be used
		 *
		 * `isOpen()` will return `true` only when the state is "open". */
		isOpen(): boolean

		/**
		 * `isClosed()` will return `true` only when the state is "closing" *or* "closed", it can be useful for determining if read and write operations are permissible.
		 *
		 *  @see [isOpen](https://github.com/Level/level-rocksdb#isOpen)
		 */
		isClosed(): boolean

		/**
		 * Returns a Readable Stream of key-value pairs. A pair is an object with `key` and `value` properties. By default it will stream all entries in the underlying store from start to end. Use the options described below to control the range, direction and results.
		 *
		 * ```ts
		 * db.createReadStream()
		 *   .on('data', function (data) {
		 *     console.log(data.key, '=', data.value)
		 *   })
		 * .on('error', function (err) {
		 *   console.log('Oh my!', err)
		 * })
		 * .on('close', function () {
		 *   console.log('Stream closed')
		 * })
		 * .on('end', function () {
		 *   console.log('Stream ended')
		 * })
		 * ```
		 */
		createReadStream(options?: Partial<CreateReadStreamOptions>): Readable
		/** Returns a Readable Stream of keys rather than key-value pairs. Use the same options as described for createReadStream to control the range and direction. */
		createKeyStream(options?: Partial<CreateKeyStreamOptions>): Readable
		/** Returns a Readable Stream of values rather than key-value pairs. Use the same options as described for createReadStream to control the range and direction. */
		createValueStream(options?: Partial<CreateValueStreamOptions>): Readable

		on(event: "put", listener: (key: KeyType, value: KeyType) => void): this
		on(event: "del", listener: (key: KeyType) => void): this
		on(event: "batch", listener: (operations: AbstractBatch[]) => void): this
		on(event: "opening", listener: () => void): this
		on(event: "open", listener: () => void): this
		on(event: "ready", listener: () => void): this
		on(event: "closing", listener: () => void): this
		on(event: "closed", listener: () => void): this

		approximateSize(start: KeyType, end: KeyType, callback: ErrorSizeCallback): void
	}

	interface Options {
		/** @default 'utf8' */
		keyEncoding: "utf8" | "hex" | "ascii" | "binary" | "base64" | "ucs2" | "utf16le" | "json"

		/** @default 'utf8' */
		valueEncoding: "utf8" | "hex" | "ascii" | "binary" | "base64" | "ucs2" | "utf16le" | "json"
	}

	interface Constructor {
		/** The main entry point for creating a new levelup instance. */
		new (location: string): LevelRocksDB
		new (location: string, options: Partial<Options>): LevelRocksDB
		new (location: string, options: Partial<Options>, callback: ErrorDBCallback): LevelRocksDB
		(location: string): LevelRocksDB
	}

	/**
	 * The main entry point for creating a new levelup instance.
	 *
	 * - `location` path to the underlying `LevelDB`.
	 * - `options` is passed on to the underlying store.
	 * - `options.keyEncoding` and `options.valueEncoding` are passed to `encoding-down`, default encoding is `'utf8'`
	 *
	 * Calling level('./db') will also open the underlying store. This is an asynchronous operation which will trigger your callback if you provide one. The callback should take the form function (err, db) {} where db is the levelup instance. If you don't provide a callback, any read & write operations are simply queued internally until the store is fully opened.
	 *
	 * This leads to two alternative ways of managing a levelup instance:
	 *
	 * ```ts
	 * level(location, options, function (err, db) {
	 *   if (err) throw err
	 *
	 *   db.get('foo', function (err, value) {
	 *     if (err) return console.log('foo does not exist')
	 *     console.log('got foo =', value)
	 *   })
	 * })
	 * ```
	 *
	 * Versus the equivalent:
	 *
	 * ```ts
	 * // Will throw if an error occurs
	 * const db = level(location, options)
	 *
	 * db.get('foo', function (err, value) {
	 *   if (err) return console.log('foo does not exist')
	 *   console.log('got foo =', value)
	 * })
	 * ```
	 *
	 * The constructor function has a `.errors` property which provides access to the different error types from `level-errors`. See example below on how to use it:
	 *
	 * ```ts
	 * level('./db', { createIfMissing: false }, function (err, db) {
	 *   if (err instanceof level.errors.OpenError) {
	 *     console.log('failed to open database')
	 *   }
	 * })
	 * ```
	 */
	const LevelRocksDB: Constructor
	export default LevelRocksDB
}

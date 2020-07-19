declare module "level" {
	import type { Readable } from "stream"
	type KeyType = string | Buffer
	type ValueType = KeyType
	type ErrorCallback = (err: Error | undefined) => void
	type ErrorValueCallback = (err: Error | undefined, value: ValueType) => void
	type ErrorKeyValueCallback = (err: Error | undefined, key: KeyType, value: ValueType) => void
	type ErrorDBCallback = (err: Error | undefined, db: LevelUpDB) => void
	type ErrorSizeCallback = (err: Error | undefined, size: number) => void
	type Encoding = "utf8" | "hex" | "ascii" | "binary" | "base64" | "ucs2" | "utf16le" | "json"

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

	interface BatchWriteOption {
		keyEncoding: Encoding
		valueEncoding: Encoding
	}

	interface AbstractChainedBatch {
		/**
		 * Queue a _put_ operation on the current batch, not committed until a `write()` is called on the batch.
		 *
		 * This method may `throw` a `WriteError` if there is a problem with your put (such as the `value` being `null` or `undefined`).
		 */
		put: (key: KeyType, value: ValueType) => this

		/**
		 * Queue a _del_ operation on the current batch, not committed until a `write()` is called on the batch.
		 *
		 * This method may `throw` a `WriteError` if there is a problem with your delete.
		 */
		del: (key: KeyType) => this

		/** Clear all queued operations on the current batch, any previous operations will be discarded. */
		clear: () => this

		/** The number of queued operations on the current batch. */
		length: number

		/**
		 * Commit the queued operations for this batch. All operations not _cleared_ will be written to the underlying store atomically, that is, they will either all succeed or fail with no partial commits.
		 *
		 * - `options` is passed on to the underlying store.
		 * - `options.keyEncoding` and `options.valueEncoding` are not supported here.
		 *
		 * If no callback is passed, a promise is returned.
		 */
		write(options?: Partial<BatchWriteOption>): Promise<void>
		write(cb: ErrorCallback): void
		write(options: Partial<BatchWriteOption>, cb: ErrorCallback): void
	}

	interface OperationOptions {
		keyEncoding: Encoding
		valueEncoding: Encoding
	}

	type GetOptions = OperationOptions
	type PutOptions = OperationOptions
	type DelOptions = OperationOptions
	type BatchOptions = OperationOptions

	interface ClearOptions {
		/** define the lower bound of the range to be deleted. Only entries where the key is greater than this option will be included in the range. When `reverse=true` the order will be reversed, but the entries deleted will be the same. */
		gt?: KeyType
		/** define the lower bound of the range to be deleted. Only entries where the key is greater than (or equal to) this option will be included in the range. When `reverse=true` the order will be reversed, but the entries deleted will be the same. */
		gte?: KeyType
		/**  define the higher bound of the range to be deleted. Only entries where the key is less than this option will be included in the range. When `reverse=true` the order will be reversed, but the entries deleted will be the same. */
		lt?: KeyType
		/**  define the higher bound of the range to be deleted. Only entries where the key is less than (or equal to) this option will be included in the range. When `reverse=true` the order will be reversed, but the entries deleted will be the same. */
		lte?: KeyType
		/**
		 * delete entries in reverse order. Only effective in combination with `limit`, to remove the last N records.
		 * @default false
		 */
		reverse?: boolean
		/**
		 * limit the number of entries to be deleted. This number represents a _maximum_ number of entries and may not be reached if you get to the end of the range first. A value of `-1` means there is no limit. When `reverse=true` the entries with the highest keys will be deleted instead of the lowest keys.
		 * @default -1
		 */
		limit?: number
	}

	/**
	 * An iterator allows you to _iterate_ the entire store or a range. It operates on a snapshot of the store, created at the time `db.iterator()` was called. This means reads on the iterator are unaffected by simultaneous writes. Most but not all implementations can offer this guarantee.
	 *
	 * An iterator keeps track of when a `next()` is in progress and when an `end()` has been called so it doesn't allow concurrent `next()` calls, it does allow `end()` while a `next()` is in progress and it doesn't allow either `next()` or `end()` after `end()` has been called.
	 */
	interface Iterator {
		/**
		 * Advance the iterator and yield the entry at that key. If an error occurs, the `callback` function will be called with an `Error`. Otherwise, the `callback` receives `null`, a `key` and a `value`. The type of `key` and `value` depends on the options passed to `db.iterator()`.
		 *
		 * If the iterator has reached its end, both `key` and `value` will be `undefined`. This happens in the following situations:
		 *
		 * - The end of the store has been reached
		 * - The end of the range has been reached
		 * - The last `iterator.seek()` was out of range.
		 *
		 * **Note:** Don't forget to call `iterator.end()`, even if you received an error.
		 */
		next(callback: ErrorKeyValueCallback): void
		/**
		 * Seek the iterator to a given key or the closest key. Subsequent calls to `iterator.next()` will yield entries with keys equal to or larger than `target`, or equal to or smaller than `target` if the `reverse` option passed to `db.iterator()` was true.
		 *
		 * If range options like `gt` were passed to `db.iterator()` and `target` does not fall within that range, the iterator will reach its end.
		 *
		 * **Note:** At the time of writing, [`leveldown`][leveldown] is the only known implementation to support `seek()`. In other implementations, it is a noop.
		 */
		seek(target: KeyType): void
		/** End iteration and free up underlying resources. The `callback` function will be called with no arguments on success or with an `Error` if ending failed for any reason. */
		end(callback: ErrorCallback): void
		/** A reference to the `db` that created this iterator. */
		db: unknown // AbstractLevelDOWN
	}

	interface CreateReadStreamOptions {
		/** Define the lower bound of the range to be streamed. Only entries where the key is greater than this option will be included in the range. When `reverse=true` the order will be reversed, but the entries streamed will be the same. */
		gt: KeyType

		/** Define the lower bound of the range to be streamed. Only entries where the key is greater than (or equal to) this option will be included in the range. When `reverse=true` the order will be reversed, but the entries streamed will be the same. */
		gte: KeyType

		/** Define the higher bound of the range to be streamed. Only entries where the key is less than this option will be included in the range. When `reverse=true` the order will be reversed, but the entries streamed will be the same. */
		lt: KeyType

		/** Define the higher bound of the range to be streamed. Only entries where the key is less than (or equal to) this option will be included in the range. When `reverse=true` the order will be reversed, but the entries streamed will be the same. */
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
	type IteratorOptions = CreateReadStreamOptions

	interface LevelUpDB {
		/**
		 * A read-only manifest. Not widely supported yet. Might be used like so:
		 * ```js
		 * if (!db.supports.permanence) {
		 *   throw new Error('Persistent storage is required')
		 * }
		 *
		 * if (db.supports.bufferKeys && db.supports.promises) {
		 *   await db.put(Buffer.from('key'), 'value')
		 * }
		 *```
		 */
		readonly supports: Manifest

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
		 * `put()`  is the primary method for inserting data into the store. Both `key` and `value` can be of any type as far as `levelup` is concerned.
		 *
		 * - `options` is passed on to the underlying store
		 * - `options.keyEncoding` and `options.valueEncoding` are passed to [`encoding-down`](https://github.com/Level/encoding-down), allowing you to override the key- and/or value encoding for this `put` operation.
		 *
		 * If no callback is passed, a promise is returned.
		 */
		put(key: KeyType, value: ValueType, options?: Partial<PutOptions>): Promise<void>
		put(key: KeyType, value: ValueType, callback: ErrorCallback): void
		put(key: KeyType, value: ValueType, options: Partial<PutOptions>, callback: ErrorCallback): void

		/**
		 * `get()` is the primary method for fetching data from the store. The `key` can be of any type. If it doesn't exist in the store then the callback or promise will receive an error. A not-found err object will be of type `'NotFoundError'` so you can `err.type == 'NotFoundError'` or you can perform a truthy test on the property `err.notFound.`
		 *
		 * ```js
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
		 * - `options` is passed on to the underlying store.
		 * - `options.keyEncoding` and `options.valueEncoding` are passed to [`encoding-down`](https://github.com/Level/encoding-down), allowing you to override the key- and/or value encoding for this `get` operation.
		 *
		 * If no callback is passed, a promise is returned.
		 * */
		get(key: KeyType, options?: Partial<GetOptions>): Promise<ValueType>
		get(key: KeyType, callback: ErrorValueCallback): void
		get(key: KeyType, options: Partial<GetOptions>, callback: ErrorValueCallback): void

		/**
		 * `del()` is the primary method for removing data from the store.
		 *
		 * ```js
		 * db.del('foo', function (err) {
		 *   if (err)
		 *   // handle I/O or other error
		 * });
		 * ```
		 * - `options` is passed on to the underlying store.
		 * - `options.keyEncoding` is passed to [`encoding-down`](https://github.com/Level/encoding-down), allowing you to override the key encoding for this `del` operation.
		 *
		 * If no callback is passed, a promise is returned.
		 */
		del(key: KeyType, options?: Partial<DelOptions>): Promise<void>
		del(key: KeyType, callback: ErrorCallback): void
		del(key: KeyType, options: Partial<DelOptions>, callback: ErrorCallback): void

		/**
		 * `batch()` can be used for very fast bulk-write operations (both _put_ and _delete_). The `array` argument should contain a list of operations to be executed sequentially, although as a whole they are performed as an atomic operation inside the underlying store.
		 *
		 * Each operation is contained in an object having the following properties: `type`, `key`, `value`, where the _type_ is either `'put'` or `'del'`. In the case of `'del'` the `value` property is ignored. Any entries with a `key` of `null` or `undefined` will cause an error to be returned on the `callback` and any `type: 'put'` entry with a `value` of `null` or `undefined` will return an error.
		 *
		 * If `key` and `value` are defined but `type` is not, it will default to `'put'`.
		 *
		 * ```js
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
		 * - `options` is passed on to the underlying store.
		 * - `options.keyEncoding` and `options.valueEncoding` are passed to [`encoding-down`](https://github.com/Level/encoding-down), allowing you to override the key- and/or value encoding of operations in this batch.
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
		 * ```js
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
		 * - _"new"_ - newly created, not opened or closed
		 * - _"opening"_ - waiting for the underlying store to be opened
		 * - _"open"_ - successfully opened the store, available for use
		 * - _"closing"_ - waiting for the store to be closed
		 * - _"closed"_ - store has been successfully closed, should not be used
		 *
		 * `isOpen()` will return `true` only when the state is "open". */
		isOpen(): boolean

		/**
		 * `isClosed()` will return `true` only when the state is "closing" _or_ "closed", it can be useful for determining if read and write operations are permissible.
		 *
		 *  @see [isOpen](https://github.com/Level/level-rocksdb#isOpen)
		 */
		isClosed(): boolean

		/**
		 * Returns a Readable Stream of key-value pairs. A pair is an object with `key` and `value` properties. By default it will stream all entries in the underlying store from start to end. Use the options described below to control the range, direction and results.
		 *
		 * ```js
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
		/**
		 * Returns a [Readable Stream](https://nodejs.org/docs/latest/api/stream.html#stream_readable_streams) of keys rather than key-value pairs. Use the same options as described for [createReadStream](https://github.com/Level/level/blob/master/README.md#createReadStream) to control the range and direction.
		 *
		 * You can also obtain this stream by passing an options object to `createReadStream()` with `keys` set to `true` and `values` set to `false`. The result is equivalent; both streams operate in [object mode](https://nodejs.org/docs/latest/api/stream.html#stream_object_mode).
		 *
		 * ```js
		 * db.createKeyStream()
		 *   .on('data', function (data) {
		 *     console.log('key=', data)
		 *   })
		 *
		 * // same as:
		 * db.createReadStream({ keys: true, values: false })
		 *   .on('data', function (data) {
		 *     console.log('key=', data)
		 *   })
		 * ```
		 */
		createKeyStream(options?: Partial<CreateKeyStreamOptions>): Readable
		/**
		 * Returns a [Readable Stream](https://nodejs.org/docs/latest/api/stream.html#stream_readable_streams) of values rather than key-value pairs. Use the same options as described for [createReadStream](https://github.com/Level/level/blob/master/README.md#createReadStream) to control the range and direction.
		 *
		 * You can also obtain this stream by passing an options object to `createReadStream()` with `values` set to `true` and `keys` set to `false`. The result is equivalent; both streams operate in [object mode](https://nodejs.org/docs/latest/api/stream.html#stream_object_mode).
		 *
		 * ```js
		 * db.createValueStream()
		 *   .on('data', function (data) {
		 *     console.log('value=', data)
		 *   })
		 *
		 * // same as:
		 * db.createReadStream({ keys: false, values: true })
		 *   .on('data', function (data) {
		 *     console.log('value=', data)
		 *   })
		 * ```
		 */
		createValueStream(options?: Partial<CreateValueStreamOptions>): Readable

		iterator(options?: Partial<IteratorOptions>): Iterator

		on(event: "put", listener: (key: KeyType, value: KeyType) => void): this
		on(event: "del", listener: (key: KeyType) => void): this
		on(event: "batch", listener: (operations: AbstractBatch[]) => void): this
		on(event: "opening", listener: () => void): this
		on(event: "open", listener: () => void): this
		on(event: "ready", listener: () => void): this
		on(event: "closing", listener: () => void): this
		on(event: "closed", listener: () => void): this

		approximateSize(start: KeyType, end: KeyType, callback: ErrorSizeCallback): void

		/**
		 * **This method is experimental. Not all underlying stores support it yet. Consult [Level/community#79](https://github.com/Level/community/issues/79) to find out if your (combination of) dependencies support `db.clear()`.**
		 *
		 * Delete all entries or a range. Not guaranteed to be atomic.
		 *
		 * If no options are provided, all entries will be deleted. The `callback` function will be called with no arguments if the operation was successful or with an `WriteError` if it failed for any reason.
		 *
		 * If no callback is passed, a promise is returned.
		 */
		clear(options?: ClearOptions): Promise<void>
		clear(callback: ErrorCallback): void
		clear(options: ClearOptions, callback: ErrorCallback): void
	}

	interface Options {
		/** @default 'utf8' */
		keyEncoding: "utf8" | "hex" | "ascii" | "binary" | "base64" | "ucs2" | "utf16le" | "json"

		/** @default 'utf8' */
		valueEncoding: "utf8" | "hex" | "ascii" | "binary" | "base64" | "ucs2" | "utf16le" | "json"

		createIfMissing: boolean

		errorIfExists: boolean
	}

	interface Constructor {
		/** The main entry point for creating a new levelup instance. */
		new (location: string): LevelUpDB
		new (location: string, options: Partial<Options>): LevelUpDB
		new (location: string, options: Partial<Options>, callback: ErrorDBCallback): LevelUpDB
		(location: string): LevelUpDB
	}

	/**
	 * The main entry point for creating a new `levelup` instance.
	 *
	 * - `location` is a string pointing to the LevelDB location to be opened or in browsers, the name of the IDBDatabase to be opened.
	 * - `options` is passed on to the underlying store.
	 * - `options.keyEncoding` and `options.valueEncoding` are passed to `encoding-down`, default encoding is `'utf8'`
	 *
	 * Calling level('my-db') will also open the underlying store. This is an asynchronous operation which will trigger your callback if you provide one. The callback should take the form `function (err, db) {}` where `db` is the `levelup` instance. If you don't provide a callback, any read & write operations are simply queued internally until the store is fully opened.
	 *
	 * This leads to two alternative ways of managing a `levelup` instance:
	 *
	 * ```js
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
	 * ```js
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
	 * ```js
	 * level('my-db', { createIfMissing: false }, function (err, db) {
	 *   if (err instanceof level.errors.OpenError) {
	 *     console.log('failed to open database')
	 *   }
	 * })
	 * ```
	 * Note that `createIfMissing` is an option specific to `leveldown`.
	 */
	const LevelUpDB: Constructor
	export default LevelUpDB

	interface Manifest {
		/** Does the db support [Buffer](https://nodejs.org/api/buffer.html) keys? May depend on runtime environment as well. Does _not_ include support of other binary types like typed arrays (which is why this is called `bufferKeys` rather than `binaryKeys`). */
		readonly bufferKeys: boolean
		/** Does the db have snapshot guarantees (meaning that reads are unaffected by simultaneous writes)? Must be `false` if any of the following is true:
		 *
		 * - Reads don't operate on a [snapshot](https://github.com/Level/abstract-leveldown#iterator)
		 * - Snapshots are created asynchronously. */
		readonly snapshots: boolean
		/** Does data survive after process exit? Is `false` for e.g. [`memdown`](https://github.com/Level/memdown), typically `true`. */
		readonly permanence: boolean
		/** Does `db.iterator()` support [`seek(..)`](https://github.com/Level/abstract-leveldown/#iteratorseektarget)? */
		readonly seek: boolean
		/** Does db support [`db.clear(..)`](https://github.com/Level/abstract-leveldown/#dbclearoptions-callback)? For an overview, see [Level/community#79](https://github.com/Level/community/issues/79). */
		readonly clear: boolean
		/** Does db have a [`status`](https://github.com/Level/abstract-leveldown/#dbstatus) property? Currently available on `abstract-leveldown` implementations, but not `levelup`. */
		readonly status: boolean
		/**
		 * Can operations like `db.put()` be called without explicitly opening the db? Like so:
		 * ```js
		 * var db = level()
		 * db.put('key', 'value', callback)
		 * ```
		 *
		 * Rather than:
		 * ```js
		 * var db = level()
		 *
		 * db.open(function (err) {
		 * if (err) throw err
		 * db.put('key', 'value', callback)
		 * })
		 * ```
		 *
		 * _TBD: whether this also includes methods like `isOpen()` and `isClosed()`._
		 */
		readonly deferredOpen: boolean
		/**
		 * Does the db constructor take a callback?
		 * ```js
		 * var db = level(.., callback)
		 * ```
		 *
		 * To the same effect as:
		 *
		 * ```js
		 * var db = level()
		 * db.open(.., callback)
		 * ```
		 */
		readonly openCallback: boolean
		readonly createIfMissing: boolean
		readonly errorIfExists: boolean
		/**
		 * Do all db methods (that don't otherwise have a return value) support promises, in addition to callbacks? Such that, when a callback argument is omitted, a promise is returned:
		 * ```js
		 * db.put('key', 'value', callback)
		 * await db.put('key', 'value')
		 * ```
		 *
		 * _Note: iterators are currently exonerated because they, at the time of writing, don't support promises anywhere._
		 */
		readonly promises: boolean
		/** Does db have the methods `createReadStream`, `createKeyStream` and `createValueStream`, following the API currently documented in `levelup`? */
		readonly streams: boolean
		/** Do all relevant db methods take `keyEncoding` and `valueEncoding` options?
		 *
		 * _TBD: what this means for `*asBuffer` options._
		 */
		readonly encodings: boolean
		/**
		 * In the form of:
		 * ```js
		 * {
		 *   foo: true,
		 *   bar: true
		 * }
		 * ```
		 * Which says the db has two methods, `foo` and `bar`, that are not part of the `abstract-leveldown` interface. It might be used like so:
		 * ```js
		 * if (db.supports.additionalMethods.foo) {
		 *   db.foo()
		 * }
		 * ```
		 *
		 * For future extensibility, the properties of `additionalMethods` should be taken as truthy rather than strictly typed booleans. We may add additional metadata (see [#1](https://github.com/Level/supports/issues/1)).
		 */
		readonly additionalMethods: Record<string, boolean>
	}
}

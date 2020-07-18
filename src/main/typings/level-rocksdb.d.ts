declare module "level-rocksdb" {
	import type { Readable } from "stream"
	type Bytes = string | Buffer
	type ErrorCallback = (err: Error | undefined) => void
	type ErrorValueCallback = (err: Error | undefined, value: Bytes) => void

	interface PutBatch {
		readonly type: "put"
		readonly key: Bytes
		readonly value: Bytes
	}
	interface DelBatch {
		readonly type: "del"
		readonly key: Bytes
	}
	type AbstractBatch = PutBatch | DelBatch

	interface AbstractChainedBatch {
		/** Queue a put operation on the current batch, not committed until a write() is called on the batch.

			This method may throw a WriteError if there is a problem with your put (such as the value being null or undefined). */
		put: (key: Bytes, value: Bytes) => this

		/** Queue a del operation on the current batch, not committed until a write() is called on the batch.

			This method may throw a WriteError if there is a problem with your delete. */
		del: (key: Bytes) => this

		/** Clear all queued operations on the current batch, any previous operations will be discarded. */
		clear: () => this

		/** The number of queued operations on the current batch. */
		length: number

		/** Commit the queued operations for this batch. All operations not cleared will be written to the underlying store atomically, that is, they will either all succeed or fail with no partial commits. */
		write(): Promise<void>
		write(cb: ErrorCallback): void
	}

	interface GetOptions {}
	interface PutOptions {}
	interface CreateReadStreamOptions {}
	interface CreateValueStreamOptions {}

	interface LevelRocksDB {
		/** Opens the underlying store. In general you should never need to call this method directly as it's automatically called by levelup().

			However, it is possible to reopen the store after it has been closed with close(), although this is not generally advised.

			If no callback is passed, a promise is returned. */
		open(cb: ErrorCallback): void

		/** close() closes the underlying store. The callback will receive any error encountered during closing as the first argument.

			You should always clean up your levelup instance by calling close() when you no longer need it to free up resources. A store cannot be opened by multiple instances of levelup simultaneously.

			If no callback is passed, a promise is returned. */
		close(cb: ErrorCallback): void

		/** get() is the primary method for fetching data from the store. The key can be of any type. If it doesn't exist in the store then the callback or promise will receive an error. A not-found err object will be of type 'NotFoundError' so you can err.type == 'NotFoundError' or you can perform a truthy test on the property err.notFound. */
		get(key: Bytes): Promise<Bytes>
		get(key: Bytes, cb: ErrorValueCallback): void
		get(key: Bytes, options: GetOptions, cb: ErrorValueCallback): void

		/** put() is the primary method for inserting data into the store. Both key and value can be of any type as far as levelup is concerned. */
		put(key: Bytes, value: Bytes): Promise<void>
		put(key: Bytes, value: Bytes, cb: ErrorValueCallback): void
		put(key: Bytes, value: Bytes, options: PutOptions, cb: ErrorValueCallback): void

		/** del() is the primary method for removing data from the store. */
		del(key: Bytes): Promise<void>
		del(key: Bytes, cb: ErrorCallback): void

		/** batch(), when called with no arguments will return a Batch object which can be used to build, and eventually commit, an atomic batch operation. Depending on how it's used, it is possible to obtain greater performance when using the chained form of batch() over the array form. */
		batch(): AbstractChainedBatch
		batch(array: AbstractBatch[]): Promise<AbstractChainedBatch>
		batch(array: AbstractBatch[], cb: ErrorCallback): AbstractChainedBatch

		/** isOpen() will return true only when the state is "open". */
		isOpen(): boolean

		/** isClosed() will return true only when the state is "closing" or "closed", it can be useful for determining if read and write operations are permissible. */
		isClosed(): boolean

		/** Returns a Readable Stream of key-value pairs. A pair is an object with key and value properties. By default it will stream all entries in the underlying store from start to end. Use the options described below to control the range, direction and results. */
		createReadStream(options?: CreateReadStreamOptions): Readable

		createValueStream(options?: CreateValueStreamOptions): Readable
	}

	interface Constructor {
		/** The main entry point for creating a new levelup instance. */
		new (location: string): LevelRocksDB
		(location: string): LevelRocksDB
	}

	const LevelRocksDB: Constructor
	export default LevelRocksDB
}

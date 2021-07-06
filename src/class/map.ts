export default class MyMap<T, V> extends Map<T, V> {
	toArray(): { name: T; value: V; }[] {
		return Array.from(this, ([name, value]) => ({ name, value }));
	}

	first(): { name: T; value: V; } | undefined {
		return this.toArray()[0];
	}

	last(): { name: T; value: V; } | undefined {
		const array = this.toArray();
		return array.pop();
	}

	search(key: T): V | undefined {
		const data = this.toArray().find((x) => x.name == key);
		return data ? data.value : undefined;
	}
}
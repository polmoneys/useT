## TLDR

Manage `T[]` in React, using `new Set()` and `useReducer`. [Demo](https://codesandbox.io/s/uset-hook-o28ose?file=/src/useTSet.ts)

## Get started 

It will work with any simpler shape like a `string`. You can pass an initial value. 

```tsx

type Chip = {
    id: number;
    name: string;
};

const [
chips,
dispatchUpdate,
hasChip,
undo,
] = useT<Chip>();

const addChip = (newChip: Chip) => {
    dispatchUpdate({ type: "add", value: newChip });
};

const removeChip = (newChip: Chip) => {
    dispatchUpdate({ type: "remove", value: newChip });
};

const objects = [
    { id: 1, name: "Object 1" },
    { id: 2, name: "Object 2" },
    { id: 3, name: "Object 3" }
];

return(
<Fragment>
    {objects.map((object) => {
        const isInSet = hasChip((item) => item.id === object.id);
        return (
            <button
            key={object.id}
            onClick={() => addChip(object)}
            disabled={isInSet}
            style={{
                color: isInSet ? "green!important" : "black!important"
            }}
            >
            Add {object.name}
            </button>
        );
    })}
    <ul>
        {Array.from(chips).map((objectChip) => (
            <li key={objectChip.id}>
            {objectChip.name}

            <button
                onClick={() => removeChip(objectChip)}
                style={{ marginLeft: "1em" }}
            >
                Delete
            </button>
            </li>
        ))}
    </ul>
    <button onClick={undo}>Undo</button>
</Fragment>
)

  ```
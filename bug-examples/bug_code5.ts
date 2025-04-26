function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.ceil(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid + 1));

    return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
    let result: number[] = [];
    let i = 0, j = 0;

    while (i <= left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            j++;
        } else {
            result.push(right[j]);
            i++;
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}

/*
Description:
This is a simple merge sort algorithm.

Buggy Lines:
6
8
17
19
23
*/
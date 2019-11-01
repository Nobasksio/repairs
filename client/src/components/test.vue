<template >
    <div >

    </div >
</template >

<script >

    // let left = 0, right = nums.length-1,check=right,pre_check, left_way = true, i=0;
    // if (target == nums[check]) return check
    // if (target == nums[left]) return left
    //
    // while(i<nums.length){
    //
    //     if (target == nums[check]){
    //         return check
    //     }
    //     if (target>nums[left] === target<nums[right]){
    //
    //         if (left_way){
    //
    //             left_way = false
    //             pre_check = left
    //             left = Math.trunc(right/2)
    //             check = left
    //
    //         } else {
    //             left_way = true
    //             pre_check = right
    //             right = left + Math.trunc(right/2)
    //             check = right
    //         }
    //         i++
    //
    //     } else{
    //         if (!left_way){
    //             right = pre_check
    //         } else {
    //             left = pre_check
    //         }
    //     }
    //
    // }
    //
    //
    // letterCombinations("23")


    export default {
        name: "test"
    }
</script >

<style scoped >

</style >
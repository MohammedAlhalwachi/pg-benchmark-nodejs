<template>
    <div class="flex flex-col justify-center items-center min-h-screen py-8">
        <h4 class="font-light text-3xl text-center">Postgres Benchmark Tester</h4>
        
        <div class="flex flex-col justify-center items-center w-full mt-16">
            <form class="flex flex-wrap w-full">
                <div class="w-full md:w-1/3 p-4">
                    <VSelect v-model="operation" label="Operations" :items="operations"></VSelect>
                    <span class="block text-sm text-red-500 p-2">{{ operationInputError }}</span>
                </div>
                <div class="w-full md:w-1/3 p-4">
                    <VSelect v-model="operationsCount" label="No. of Operations" :items="numberOfEntries"></VSelect>
                    <span class="block text-sm text-red-500 p-2">{{ operationsCountInputError }}</span>
                </div>
                <div class="w-full md:w-1/3 p-4">
                    <VSelect v-model="groupsCount" label="Divided into" :items="numberOfGroups"></VSelect>
                    <span class="block text-sm text-red-500 p-2">{{ groupsCountInputError }}</span>
                </div>
            </form>
        </div>
        
        <div v-if="times.length" class="font-light self-start w-full mt-16">
            <h5 class="capitalize text-2xl">{{ operation }}</h5>
            <table class="table-fixed w-full mt-4">
                <thead class="font-normal">
                    <tr>
                        <td class="px-4 py-2">Entries</td>
                        <td class="px-4 py-2">Time (ms)</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="time in times">
                        <td class="border px-4 py-2">{{ batchCount }} entry</td>
                        <td class="border px-4 py-2">{{ time }} ms</td>
                    </tr>
                </tbody>
                <tfoot class="bg-gray-200">
                    <tr>
                        <td class="border px-4 py-2">Average</td>
                        <td class="border px-4 py-2">{{ timesAvg.toFixed(2) }} ms</td>
                    </tr>
                    <tr>
                        <td class="border px-4 py-2">Total</td>
                        <td class="border px-4 py-2">{{ timesTotal.toFixed(2) }} ms</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <button @click="execute" class="transition-all duration-200 font-light text-2xl hover:bg-flame rounded focus:outline-none focus:shadow-outline px-20 py-2 mt-16">Start</button>
    </div>
</template>

<script>
import VSelect from "@/components/VSelect";
export default {
    components: {VSelect},
    data() {
        return {
            operation: '',
            operationsCount: '',
            groupsCount: '',
            operationInputError: '',
            operationsCountInputError: '',
            groupsCountInputError: '',
            operations: [
                { text: 'Insert', value: 'insert' },
                { text: 'Update', value: 'update' },
                { text: 'Delete', value: 'delete' },
            ],
            numberOfEntries: [
                { text: '1000 Entries', value: 1000 },
                { text: '2000 Entries', value: 2000 },
                { text: '3000 Entries', value: 3000 },
                { text: '4000 Entries', value: 4000 },
            ],
            numberOfGroups: [
                { text: '1 Group', value: 1 },
                { text: '2 Groups', value: 2 },
                { text: '3 Groups', value: 3 },
                { text: '4 Groups', value: 4 },
            ],
            times: [],
        };
    },
    computed: {
        batchCount() {
            return Math.round(this.operationsCount / this.groupsCount)
        },
        timesTotal() {
            return this.times.reduce((acc, time) => acc + time, 0);
        },
        timesAvg() {
            if(this.times)
                return this.timesTotal / this.times.length;
            else
                return 0;
        }
    },
    watch: {
        operation() {
            this.clearTimes()
        },
        operationsCount() {
            this.clearTimes()
        },
        groupsCount() {
            this.clearTimes()
        },
    },
    methods: {
        clearTimes() {
            this.times = [];
        },
        async execute() {
            try {
                let isError = false;
                if(this.operation === ''){
                    this.operationInputError = 'Operation type is required';
                    isError = true;
                }else 
                    this.operationInputError = '';
                
                if(this.operationsCount === ''){
                    this.operationsCountInputError = 'Number of operations is required';
                    isError = true;
                } else 
                    this.operationsCountInputError = '';
                
                if(this.groupsCount === ''){
                    this.groupsCountInputError = 'Groups of operations is required';
                    isError = true;
                } else 
                    this.groupsCountInputError = '';

                if (isError) return;
                
                
                const result = await this.$axios.get(`/api/benchmark/${this.operation}`, {
                    params: {
                        operationsCount: this.operationsCount,
                        groupsCount: this.groupsCount,
                    }
                }).then(res => res.data);

                this.times = result.times;
                this.isDirty = false;
            }catch (err){
                console.error(err)
            }
        }
    }
}
</script>

<style>
</style>

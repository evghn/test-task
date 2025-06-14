<template>
    <div class="container">
        <div class="management_block">
            <div class="btn">Создать встречу</div>
            <input type="search" class="search_input" placeholder="Поиск ....">
        </div>
        <div class="tasks_block">
            <h3 class="tasks_header">Список ваших задач</h3>
            <div class="tasks_container">
                
            </div>
        </div>
    </div>
</template>
<style scoped>
    .btn {
        margin: 40px auto;
    }

    .container {
        flex-direction: column;
        align-items: center;

        margin: 0 auto;
        width: clamp(200px, 90%, 1200px);
        justify-content: center;
        display: flex;
    }



    .management_block {
        width: 90%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        /* flex-wrap: wrap;/ */
    }

    .a-c {
        align-items: center;
    }
    .tasks_header {
        color: #2b2b2b;
    }
</style>
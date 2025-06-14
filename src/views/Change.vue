<template>
    <div class="container">
        <div class="create_block">
            <h2>Создание задачи</h2>
            <div class="form-group">
                <label for="location">Ваш путь</label>
                <div class="location-display">Задача 1/Задача 1.1</div>
            </div>

            <div class="tree-block">
                <h3 class="tree-header">Расположение в дереве</h3>

            </div>

            <div class="form-actions">
                <button type="submit">Сохранить</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .form-actions button {
        padding: 12px;
        font-size: 16px;
        background-color: #2a50d5;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    }

    .create_block {
        max-width: 720px;
        margin: 60px auto;
        background-color: white;
        border-radius: 15px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        padding: 25px;

        & h2 {
            text-align: center;
            color: #2a50d5;
            font-size: 22px;
            margin-bottom: 25px;
        }
    }

    .form-group {
        margin-bottom: 25px;
    }

    .form-group label {
        display: block;
        margin-bottom: 10px;
        font-size: 16px;
        color: #333;
    }

    .form-group input[type="text"] {
        width: 100%;
        padding: 12px;
        font-size: 16px;
        border-radius: 8px;
        background-color: #d6dcff;
    }

    .form-group input[type="text"]:focus {
        outline: none;
        border-color: #2a50d5;
        background-color: #ffffff;
    }

    .form-group button {
        background-color: #2a50d5;
        color: white;
        border: none;
        padding: 12px;
        font-size: 16px;
        border-radius: 8px;
        cursor: pointer;
        display: block;
        width: 40%;
        margin-top: 10px;
        justify-self: start;
    }

    .form-group button:hover {
        background-color: #1d3c9e;
    }

    .form-group .location-display {
        font-size: 16px;
        margin-bottom: 12px;
        color: #555;
        width: 100%;
        padding: 12px;
        font-size: 16px;
        border-radius: 8px;
        background-color: #d6dcff;
    }

    .form-actions {
        text-align: center;

        & button {
            width: 150px !important;
        }
    }

    .form-actions button:hover {
        background-color: #1d3c9e;
    }

    .tree-block {
        height: 300px;
        overflow-y: scroll;
    }

    .tree-header {
        color: #2a50d5;
    }

    /* Media queries for tablet and phone */
    @media (max-width: 768px) {
        .create_block {
            margin: 30px auto;
            padding: 15px;
            max-width: 90%;
        }

        .form-group button {
            width: 60%;
            font-size: 14px;
            text-wrap: nowrap;
            margin-top: 10px;
        }

        .form-group input[type="text"] {
            padding: 10px;
            font-size: 14px;
        }

        .form-group label {
            font-size: 14px;
        }

        .form-actions button {
            width: 100%;
            padding: 10px;
            font-size: 14px;
        }

        .create_block h2 {
            font-size: 18px;
            margin-bottom: 15px;
        }
    }

    @media (max-width: 480px) {
        .create_block {
            margin: 15px auto;
            padding: 10px;
            max-width: 70%;
        }

        .form-group input[type="text"] {
            padding: 8px;
            font-size: 12px;
        }

        .form-group label {
            font-size: 12px;
        }

        .form-actions button {
            width: 100%;
            padding: 8px;
            font-size: 12px;
        }

        .create_block h2 {
            font-size: 16px;
            margin-bottom: 10px;
        }

        .form-group button {
            padding: 8px;
            font-size: 12px;
        }
    }
</style>
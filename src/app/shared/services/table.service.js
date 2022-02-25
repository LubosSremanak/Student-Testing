class TableService {

    constructor() {
    }


    getIconButton(id, faType) {
        const iconButton = document.createElement("BUTTON");
        iconButton.setAttribute("id", id);
        const icon = document.createElement("I");
        icon.classList = ('fas ' + faType);
        iconButton.append(icon);
        return iconButton;
    }


    getColumn(text) {
        const column = document.createElement("TD");
        const span = document.createElement("SPAN");
        const div = document.createElement("DIV");
        span.innerText = text;
        span.classList.add("column-text")
        div.appendChild(span)
        div.classList.add("column-text-container")
        column.appendChild(div);
        return column;
    }

    getRow(columns) {
        const row = document.createElement("TR")
        columns.forEach((column) => {
            row.appendChild(column);
        });
        return row;
    }

    getEmptyTablePlaceholder(message) {
        const el = document.createElement("td");
        el.innerText = message;
        el.setAttribute("colspan", 3);
        el.classList.add("empty-table")
        return el;
    }

}

export const tableService = new TableService();

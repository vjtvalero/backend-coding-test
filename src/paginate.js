const DEFAULT_PAGE_COUNT = 10

const paginate = ({ pageIndex, pageSize }) => {
    let currentPage = 1
    let perPage = DEFAULT_PAGE_COUNT
    let pageClause = ''
    if (pageIndex) {
        currentPage = pageIndex
        if (pageSize) {
            perPage = pageSize
        }
        pageClause = ` LIMIT ${perPage} OFFSET ${(currentPage - 1) * perPage}`
    }
    return { currentPage, perPage, pageClause }
}

module.exports = paginate

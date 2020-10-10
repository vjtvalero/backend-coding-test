const DEFAULT_PAGE_COUNT = 10

const paginate = ({ pageIndex, pageSize }) => {
    let currentPage = 1
    let perPage = DEFAULT_PAGE_COUNT
    let pageClause = ''
    const args = []
    if (pageIndex) {
        currentPage = pageIndex
        if (pageSize) {
            perPage = pageSize
        }
        pageClause = ' LIMIT ? OFFSET ?'
        args.push(perPage, (currentPage - 1) * perPage)
    }
    return { currentPage, perPage, pageClause, args }
}

module.exports = paginate

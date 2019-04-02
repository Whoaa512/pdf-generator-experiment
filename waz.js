/* @jsx JsxPdf.createElement */
/* global moment JsxPdf */
/* eslint-disable react/react-in-jsx-scope,react/prop-types,react/style-prop-object,no-magic-numbers */
// const Footer = props => (
// )
const DEFAULT_EXPIRES_DAYS = 10
const DATE_FMT = 'MMMM DD, YYYY'
const FICTIV_LOGO =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHYAAAAoCAYAAAArIw6WAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA5dJREFUeNrsXI1t4jAUfqAOkNsgI3SD5iaIOwG5CeAmaDoBZQJgAugE0AnIBrABbMAlki3lLD/n2flznHzSkyrqxvH7/H5tCjDBS8wMxga5vHIJ+GePXL6kcSGXMopxmcd6FLqRcXb5paNcDrk8EZGRKsacPDeQiKibzvBSsQu3ubDJsQ0POmJPiHuZMGBi0xGR+qyZeziJOeKCP5DxRTLwnssvvvjZZBvDwQpJBBKPLdaZpKdNqDLgreeueBTEXhULjSZih9+g8DKZGFvy9DKgd1V1vkRCd+MyoURsoah1xbi6naOinfjXkswiaVtoyi+RwRfEHnPZVJAsbwwVsNCDbSBMh78ViWksffbglYYNIqSCeRe/fLYsJwtCi1r6bjlfkeyFmk1qu45Uo2BKrGbIONuewVbxrAtWx/aNV678D4JlYUj4Al1rhx4Ri19YejPV+jYuEitIbaLrFfDSLXSQXJUlm4IhG/8oYmyxgz4VMauMT4MJ3yzLo5CTillpkSTtebzOJDcY84XKJH45mFRteKyV184Q0jHECKmPtuq61DLGXpC57wYbJSnF5SsxSWqijjV9zqVmEyhA5mNtFuw2xCbIvBeLOBvwv4taIKSp5yTIBqZiZfP3fRB7RV607fjYF7GYxSXE+VQW/1+55ULyxBAC/3jcdCji4I4YN1W5iCq53LtGbIw0Ao7gN74NMl3ZjasaQJlrxEZYLeY5sJq2qvRZVFmrK8SGyA6EkZArY1lR54eU58wdtFZRs44BewPyMGtVWv4cJvSJDPFOzCC+qmL1RKyjVrskJlZYdt07sTeDuOsrdsSSJibGaKeJHdN95gdC0EJqaDCitTvjis+Whbrv7phVuOGbLsl0gdgfJEno0x0HHc+nOpUJS+TGJtbqCrE75PN1B+RkhmVY13p407jhnevE3gA/fE5rkEo5sH+A+vxy6Yg7jpBNloFFH72P050Q9PeXTJsed6CfA28bmDeCZk6JVKc2Kn0mNjunr4P2lYZcyv0lBuqLapElKeK9KY35pojV6aAswZCI1VlP+Yz2wOcQcgD9bUbK3Aeg31Rsk9gAaDcwYWjEUsg1kSuxJg4Av5rTJbGUTcaGSqwod+41Sd0auqwAaHeO2yaWVXgsGDKxQtFrC4IPNcuVpILgtokFzZrJJeCMWMOdDV4qhOb/awzjNZ3uuzs/pZ+balKo5ks1Y+vorQzsaygZaK6XlvFPgAEA7Rl/noy7E1YAAAAASUVORK5CYII='
const FICTIV_URL = 'www.fictiv.com'
const quoteName = 'winslow2074'
const QUOTE_ID = `Quote #: ${quoteName}`

const createdAt = moment('April 01, 2019')
const validUntil = moment(createdAt).add(DEFAULT_EXPIRES_DAYS, 'days')
const user = {
    displayName: 'CJ Winslow',
    email: 'cj@fictiv.com',
}
const userAddress = {
    street1: '5223 Gordon Ave',
    city: 'El Cerrito',
    state: 'CA',
    postalCode: '94530',
}

const qmrs = [
    {
        name: 'nutpiece_v2.step',
        materialName: 'Rubber-like',
        quantity: 11,
        unitCostInCents: 1584,
        totalCostInCents: 17424,
    },
    {
        name: 'nutpiece_v2.step',
        materialName: 'PLA',
        quantity: 1,
        unitCostInCents: 1421,
        totalCostInCents: 1421,
    },
    {
        name: 'gianni_baseplate_1.step',
        materialName: '6061 Aluminum',
        quantity: 2,
        unitCostInCents: 23384,
        totalCostInCents: 46768,
    },
]
const quoteModelRevisions = Array.from({ length: 1 }, () => qmrs).reduce(
    (m, l) => [...m, ...l],
    [],
)
const shippingName = 'Standard'

const BILLING_EMAIL = 'billing@fictiv.com'
const FICTIV_ADDRESS = {
    street1: '168 Welsh St.',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    phone: '(415) 580-2509',
}
const _map = (list, mapper) => Array.from(list, mapper)

const cellBorder = ({ top, bottom, left, right }) =>
    [left, top, right, bottom].map(Boolean)
const toPriceStr = cents => `$${(cents / 100).toFixed(2)}`

const Link = ({ children, href, ...props }) => (
    <text link={href} {...props}>
        {children}
    </text>
)
const Email = ({ children, ...props }) => (
    <Link href={`mailto:${children}`} {...props}>
        {children}
    </Link>
)

function Address({
    street1,
    street2,
    city,
    state,
    postalCode,
    phone,
    ...props
}) {
    return (
        <stack {...props}>
            <text>{street1}</text>
            {street2 != null && <text>{street2}</text>}
            <text>
                {city}, {state} {postalCode}
            </text>
            {phone != null && <text>{phone}</text>}
        </stack>
    )
}
const FICTIV_LINK = (
    <Link marginBottom={12} href={FICTIV_URL}>
        {FICTIV_URL}
    </Link>
)

const styles = {
    labelHeader: {
        bold: true,
    },
    smallFont: {
        fontSize: 12,
    },
}
const headCellBorder = cellBorder({ top: true, bottom: true })
const subtotalCost = quoteModelRevisions.reduce(
    (memo, { totalCostInCents }) => memo + totalCostInCents,
    0,
)
const taxCost = 5578
const shippingCost = 1267
const totalCost = subtotalCost + taxCost + shippingCost

/* eslint-disable-next-line no-unused-vars */
const doc = (
    <document
        pageMargins={32}
        pageSize="A4"
        info={{
            author: 'Buzz Lightyear',
            title: 'My awesome pdf!',
            subject: 'subject of document',
            keywords: 'keywords for document',
        }}
        defaultStyle={{
            font: 'OpenSans',
            fontSize: 12,
        }}
        styles={styles}
    >
        <content>
            <columns columnGap={10}>
                <column width="30%">
                    <image src={FICTIV_LOGO} width={88} height={30} />
                    <stack style="smallFont">
                        {FICTIV_LINK}
                        <text>Remit to: Fictiv, Inc.</text>
                        <Address {...FICTIV_ADDRESS} />
                        <Email>{BILLING_EMAIL}</Email>
                    </stack>
                </column>
                <column width="*" />
                <column width="30%" alignment="right">
                    <text style="labelHeader">QUOTE DETAILS</text>
                    <stack style="smallFont">
                        <text>{QUOTE_ID}</text>
                        <text>Created on: {createdAt.format(DATE_FMT)}</text>
                        <text>Valid until: {validUntil.format(DATE_FMT)}</text>
                    </stack>
                    <text style="labelHeader" marginTop={16}>
                        PREPARED FOR
                    </text>
                    <stack style="smallFont">
                        <text>{user.displayName}</text>
                        <Email>{user.email}</Email>
                        <Address {...userAddress} />
                    </stack>
                </column>
            </columns>
            <text marginTop={20} style="labelHeader">
                SUMMARY OF QUOTE
            </text>
            <table
                widths={['*', 'auto', 'auto', 'auto']}
                headerRows={1}
                layout={{
                    defaultBorder: false,
                }}
            >
                <row>
                    <cell marginTop={8} border={headCellBorder}>
                        PRODUCT NAME
                    </cell>
                    <cell
                        marginTop={8}
                        alignment="right"
                        border={headCellBorder}
                    >
                        QTY
                    </cell>
                    <cell
                        marginTop={8}
                        alignment="right"
                        border={headCellBorder}
                    >
                        COST/UNIT
                    </cell>
                    <cell
                        marginTop={8}
                        alignment="right"
                        border={headCellBorder}
                    >
                        TOTAL
                    </cell>
                </row>
                {_map(quoteModelRevisions, qmr => {
                    const {
                        name,
                        materialName,
                        quantity,
                        unitCostInCents,
                        totalCostInCents,
                    } = qmr

                    return (
                        <row>
                            <cell>
                                {name} ({materialName})
                            </cell>
                            <cell noWrap alignment="right">
                                {quantity}
                            </cell>
                            <cell noWrap alignment="right">
                                {toPriceStr(unitCostInCents)}
                            </cell>
                            <cell noWrap alignment="right">
                                {toPriceStr(totalCostInCents)}
                            </cell>
                        </row>
                    )
                })}
            </table>
            <table
                marginTop={16}
                headerRows={0}
                layout={{
                    defaultBorder: false,
                }}
                widths={['*', 'auto', 'auto']}
            >
                <row>
                    <cell />
                    <cell noWrap>Subtotal</cell>
                    <cell noWrap alignment="right">
                        {toPriceStr(subtotalCost)}
                    </cell>
                </row>
                <row>
                    <cell />
                    <cell noWrap>Tax</cell>
                    <cell noWrap alignment="right">
                        {toPriceStr(taxCost)}
                    </cell>
                </row>
                <row>
                    <cell />
                    <cell noWrap>Shipping ({shippingName})</cell>
                    <cell noWrap alignment="right">
                        {toPriceStr(shippingCost)}
                    </cell>
                </row>
                <row>
                    <cell />
                    <cell noWrap bold border={cellBorder({ top: true })}>
                        Total
                    </cell>
                    <cell
                        noWrap
                        alignment="right"
                        bold
                        border={cellBorder({ top: true })}
                    >
                        {toPriceStr(totalCost)}
                    </cell>
                </row>
            </table>
        </content>
        <footer style="smallFont">
            {(currentPage, pageCount) => {
                return (
                    <columns>
                        <column bold marginLeft={32}>
                            {QUOTE_ID}
                        </column>
                        <column alignment="center">{FICTIV_LINK}</column>
                        <column alignment="right" bold marginRight={32}>
                            Page {currentPage} of {pageCount}
                        </column>
                    </columns>
                )
            }}
        </footer>
    </document>
)

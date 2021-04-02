export const currentUserModule = {
    state: () => ({
        isMarketAuthority: false,
    }),
    mutations: {
        SET_ISMARKETAUTHORITY(state, newVal) {
            state.isMarketAuthority = newVal
        },
    },
    actions: {
        setIsMarketAuthority(ctx, newVal) {
            console.log(newVal)
            ctx.commit('SET_ISMARKETAUTHORITY', newVal)
        },
    },
    namespaced: true,
}

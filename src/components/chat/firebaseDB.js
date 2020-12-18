import {useMemo,useState, useEffect}  from 'react'
import {database} from "../../firebase"

// カスタムフックにしておく
const useDatabase = () => {
    // 同じパスでは毎回同じ結果が得られるのでmemo化しておく
    return useMemo(() => database.ref('/messages').orderByChild('createAt').limitToLast(30), []);
};

// hooksを使いたいのでカスタムhooksにしておく
const useFetchData = (ref) => {
    const [data, setData] = useState();
    useEffect(() => {
        // イベントリスナーを追加するにはonを使う
    ref.on('value', snapshot => {
            // パスに対する全データを含むsnapshotが渡される
            // ない場合はnullが変えるので存在をチェックしておく
        if (snapshot?.val()) {
            console.log("snapshot.val()")
            setData(snapshot.val());
        }
    });
    return () => {
        ref.off();
    };
    // refの変更に応じて再取得する
    }, [ref]);
    // データを返却する
    return { data };
}

// 実際に呼び出す際はこちらを使う
export const useFetchAllData = () => {
    // refを取得して
    const ref = useDatabase();
    // ref渡してデータを取得する
    return useFetchData(ref);
};